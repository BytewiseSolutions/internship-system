import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { EmployerSidebarComponent } from '../../../components/employer/employer-sidebar/employer-sidebar.component';
import { EmployerHeaderComponent } from '../../../components/employer/employer-header/employer-header.component';

@Component({
  selector: 'app-manage-applications',
  standalone: true,
  imports: [CommonModule, EmployerSidebarComponent, EmployerHeaderComponent],
  templateUrl: './manage-applications.component.html',
  styleUrls: ['./manage-applications.component.scss']
})
export class ManageApplicationsComponent implements OnInit {
  isSidebarCollapsed = false;
  applications: any[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadApplications();
  }

  onSidebarCollapseChanged(collapsed: boolean): void {
    this.isSidebarCollapsed = collapsed;
  }

  loadApplications(): void {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    this.http.get(`http://localhost:8000/applications/get_applications.php?company_id=${user.companyId}`)
      .subscribe({
        next: (response: any) => {
          this.applications = response.applications || [];
        },
        error: (error) => {
          console.error('Error loading applications:', error);
        }
      });
  }

  updateStatus(applicationId: number, status: string): void {
    const data = {
      application_id: applicationId,
      status: status
    };

    this.http.post('http://localhost:8000/applications/update_status.php', data)
      .subscribe({
        next: (response: any) => {
          if (response.success) {
            this.showNotification(`Application status updated to ${status}. Email notification sent to student.`);
            this.loadApplications();
          }
        },
        error: (error) => {
          console.error('Error updating application status:', error);
          this.showNotification('Error updating application status', 'error');
        }
      });
  }

  private showNotification(message: string, type: string = 'success'): void {
    // Simple notification - you can enhance this with a proper notification service
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      padding: 15px;
      background: ${type === 'success' ? '#2e7d32' : '#d32f2f'};
      color: white;
      border-radius: 4px;
      z-index: 1000;
    `;
    document.body.appendChild(notification);
    setTimeout(() => notification.remove(), 3000);
  }
}