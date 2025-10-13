import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { StudentHeaderComponent } from '../../components/student/student-header/student-header.component';
import { StudentSidebarComponent } from '../../components/student/student-sidebar/student-sidebar.component';
import { AuthService } from '../../services/auth.service';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-student-dashboard',
  imports: [StudentHeaderComponent, StudentSidebarComponent, RouterLink],
  templateUrl: './student-dashboard.component.html',
  styleUrl: './student-dashboard.component.scss'
})
export class StudentDashboardComponent {
  isSidebarCollapsed = false;
  studentStats: any = {};
  userName: string = '';

  constructor(
    private authService: AuthService,
    private router: Router,
    private http: HttpClient
  ) { }

  ngOnInit() {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    this.userName = user.name || 'Student';
    this.http.get<any>(`${environment.apiUrl}/students/get_dashboard_stats.php?student_id=${user.id}`)
      .subscribe({
        next: (data) => {
          console.log("Dashboard stats:", data);
          this.studentStats = data;
        },
        error: (err) => {
          console.error('Error loading dashboard stats:', err);
          // Set default values on error
          this.studentStats = {
            applications: 0,
            reviews: 0,
            notifications: 0,
            internships: 0
          };
        }
      });
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  onSidebarCollapseChanged(collapsed: boolean) {
    this.isSidebarCollapsed = collapsed;
  }
}
