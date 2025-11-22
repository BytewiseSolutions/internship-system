import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { StudentHeaderComponent } from '../../components/student/student-header/student-header.component';
import { StudentSidebarComponent } from '../../components/student/student-sidebar/student-sidebar.component';
import { DashboardCardComponent } from '../../shared/components/dashboard-card/dashboard-card.component';
import { StatCardComponent } from '../../shared/components/stat-card/stat-card.component';
import { QuickActionsComponent, QuickAction } from '../../shared/components/quick-actions/quick-actions.component';

interface ActivityItem {
  id: string;
  type: 'application' | 'interview' | 'logbook' | 'internship';
  text: string;
  timestamp: Date;
  icon: string;
}

@Component({
  selector: 'app-student-dashboard',
  standalone: true,
  imports: [
    CommonModule, 
    RouterModule, 
    StudentHeaderComponent, 
    StudentSidebarComponent,
    DashboardCardComponent,
    StatCardComponent,
    QuickActionsComponent
  ],
  templateUrl: './student-dashboard.component.html',
  styleUrls: ['./student-dashboard.component.scss']
})
export class StudentDashboardComponent implements OnInit {
  isSidebarCollapsed = false;
  userName = '';
  lastLogin?: Date;
  loading = true;
  
  studentStats = {
    applications: 0,
    interviews: 0,
    internships: 0,
    logbookEntries: 0
  };

  previousStats = {
    applications: 0,
    interviews: 0,
    internships: 0,
    logbookEntries: 0
  };

  quickActions: QuickAction[] = [
    {
      id: 'browse',
      label: 'Browse Internships',
      icon: 'fas fa-search',
      route: '/browse-internships',
      variant: 'primary',
      ariaLabel: 'Browse available internships'
    },
    {
      id: 'applications',
      label: 'My Applications',
      icon: 'fas fa-file-alt',
      route: '/my-applications',
      variant: 'outline',
      ariaLabel: 'View my internship applications'
    },
    {
      id: 'logbook',
      label: 'Update Logbook',
      icon: 'fas fa-book',
      route: '/logbook',
      variant: 'outline',
      ariaLabel: 'Update internship logbook'
    },
    {
      id: 'profile',
      label: 'Edit Profile',
      icon: 'fas fa-user',
      route: '/profile',
      variant: 'outline',
      ariaLabel: 'Edit student profile'
    }
  ];

  recentActivity: ActivityItem[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit() {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    this.userName = user.name || 'Student';
    this.lastLogin = user.lastLogin ? new Date(user.lastLogin) : undefined;
    
    this.loadStudentStats();
    this.loadRecentActivity();
  }

  loadStudentStats() {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const studentId = user.id;
    
    if (!studentId) {
      console.error('No student ID found');
      this.loading = false;
      return;
    }

    // Load previous stats for comparison
    const savedStats = localStorage.getItem('previousStats');
    if (savedStats) {
      this.previousStats = JSON.parse(savedStats);
    }

    this.http.get(`${environment.apiUrl}/api/student/get_student_stats.php?student_id=${studentId}`).subscribe({
      next: (stats: any) => {
        this.studentStats = stats;
        // Save current stats as previous for next comparison
        localStorage.setItem('previousStats', JSON.stringify(this.studentStats));
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading student stats:', error);
        // Fallback to mock data if API fails
        this.studentStats = {
          applications: 3,
          interviews: 1,
          internships: 0,
          logbookEntries: 5
        };
        this.loading = false;
      }
    });
  }

  loadRecentActivity() {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const studentId = user.id;
    
    if (!studentId) return;

    // Mock recent activity - replace with actual API call
    this.recentActivity = [
      {
        id: '1',
        type: 'application',
        text: 'Applied to Software Developer Internship at TechCorp',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
        icon: 'fas fa-paper-plane'
      },
      {
        id: '2',
        type: 'logbook',
        text: 'Added new logbook entry for Week 3',
        timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
        icon: 'fas fa-edit'
      },
      {
        id: '3',
        type: 'interview',
        text: 'Interview scheduled with DataSoft Solutions',
        timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
        icon: 'fas fa-calendar-check'
      }
    ];
  }

  getChangeText(statType: keyof typeof this.studentStats): string {
    const current = this.studentStats[statType];
    const previous = this.previousStats[statType];
    const change = current - previous;
    
    if (change === 0) return '';
    return `${Math.abs(change)} ${change > 0 ? 'increase' : 'decrease'}`;
  }

  getChangeType(statType: keyof typeof this.studentStats): 'positive' | 'negative' | 'neutral' {
    const current = this.studentStats[statType];
    const previous = this.previousStats[statType];
    const change = current - previous;
    
    if (change > 0) return 'positive';
    if (change < 0) return 'negative';
    return 'neutral';
  }

  trackActivity(index: number, item: ActivityItem): string {
    return item.id;
  }

  onSidebarCollapseChanged(collapsed: boolean) {
    this.isSidebarCollapsed = collapsed;
  }
}