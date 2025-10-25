import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { StudentHeaderComponent } from '../../components/student/student-header/student-header.component';
import { StudentSidebarComponent } from '../../components/student/student-sidebar/student-sidebar.component';

@Component({
  selector: 'app-student-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, StudentHeaderComponent, StudentSidebarComponent],
  templateUrl: './student-dashboard.component.html',
  styleUrls: ['./student-dashboard.component.scss']
})
export class StudentDashboardComponent implements OnInit {
  isSidebarCollapsed = false;
  userName = '';
  studentStats = {
    applications: 0,
    interviews: 0,
    internships: 0,
    logbookEntries: 0
  };
  loading = true;

  constructor(private http: HttpClient) {}

  ngOnInit() {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    this.userName = user.name || 'Student';
    this.loadStudentStats();
  }

  loadStudentStats() {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const studentId = user.id;
    
    if (!studentId) {
      console.error('No student ID found');
      this.loading = false;
      return;
    }

    this.http.get(`${environment.apiUrl}/api/student/get_student_stats.php?student_id=${studentId}`).subscribe({
      next: (stats: any) => {
        this.studentStats = stats;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading student stats:', error);
        // Fallback to mock data if API fails
        this.studentStats = {
          applications: 0,
          interviews: 0,
          internships: 0,
          logbookEntries: 0
        };
        this.loading = false;
      }
    });
  }

  onSidebarCollapseChanged(collapsed: boolean) {
    this.isSidebarCollapsed = collapsed;
  }
}