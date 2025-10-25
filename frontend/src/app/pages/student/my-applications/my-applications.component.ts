import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { environment } from '../../../../environments/environment';
import { StudentHeaderComponent } from '../../../components/student/student-header/student-header.component';
import { StudentSidebarComponent } from '../../../components/student/student-sidebar/student-sidebar.component';

interface Application {
  application_id: number;
  status: string;
  applied_at: string;
  cv_path: string;
  transcript_path: string;
  application_letter_path: string;
  internship_title: string;
  internship_description: string;
  location: string;
  deadline: string;
  company_name: string;
  company_email: string;
  company_address: string;
}

@Component({
  selector: 'app-my-applications',
  standalone: true,
  imports: [CommonModule, StudentHeaderComponent, StudentSidebarComponent, RouterModule],
  templateUrl: './my-applications.component.html',
  styleUrls: ['./my-applications.component.scss']
})
export class MyApplicationsComponent implements OnInit {
  isSidebarCollapsed = false;
  applications: Application[] = [];
  loading = true;
  error = '';

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.loadApplications();
  }

  onSidebarCollapseChanged(collapsed: boolean) {
    this.isSidebarCollapsed = collapsed;
  }

  loadApplications() {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const userId = user.id;
    if (!userId) {
      this.error = 'User not found';
      this.loading = false;
      return;
    }

    this.http.get<any>(`${environment.apiUrl}/applications/get_student_applications.php?user_id=${userId}`)
      .subscribe({
        next: (response) => {
          if (response.success) {
            this.applications = response.applications;
          } else {
            this.error = response.message;
          }
          this.loading = false;
        },
        error: (err) => {
          this.error = 'Failed to load applications';
          this.loading = false;
        }
      });
  }

  getStatusClass(status: string): string {
    switch (status.toLowerCase()) {
      case 'pending': return 'status-pending';
      case 'accepted': return 'status-accepted';
      case 'rejected': return 'status-rejected';
      default: return 'status-pending';
    }
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString();
  }
}