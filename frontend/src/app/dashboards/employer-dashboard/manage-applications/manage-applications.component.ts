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
  loading = false;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadApplications();
  }

  onSidebarCollapseChanged(collapsed: boolean): void {
    this.isSidebarCollapsed = collapsed;
  }

  loadApplications(): void {
    this.loading = true;
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    this.http.get(`http://localhost:8000/applications/get_applications.php?company_id=${user.companyId}`)
      .subscribe({
        next: (response: any) => {
          this.applications = response.applications || [];
          this.loading = false;
        },
        error: (error) => {
          console.error('Error loading applications:', error);
          this.showNotification('Error loading applications', 'error');
          this.loading = false;
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

  viewDocuments(application: any): void {
    const baseUrl = 'http://localhost:8000/applications/download_document.php?file=';
    const directUrl = 'http://localhost:8000/';
    const documents = [
      { name: 'CV', path: application.cv_path },
      { name: 'Transcript', path: application.transcript_path },
      { name: 'Application Letter', path: application.application_letter_path }
    ].filter(doc => doc.path); // Only show documents that exist

    if (documents.length === 0) {
      this.showNotification('No documents available for this application', 'error');
      return;
    }

    // Create modal to display document links
    const modal = document.createElement('div');
    modal.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0,0,0,0.5);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 1000;
    `;

    const modalContent = document.createElement('div');
    modalContent.style.cssText = `
      background: white;
      padding: 30px;
      border-radius: 8px;
      max-width: 500px;
      width: 90%;
      max-height: 80%;
      overflow-y: auto;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    `;

    modalContent.innerHTML = `
      <h3 style="margin-top: 0; color: #333; border-bottom: 2px solid #007bff; padding-bottom: 10px;">Application Documents</h3>
      <div style="margin-bottom: 15px; color: #666;">
        <strong>Student:</strong> ${application.student_name}<br>
        <strong>Email:</strong> ${application.student_email || 'N/A'}<br>
        <strong>Internship:</strong> ${application.internship_title}
      </div>
      <div style="margin-bottom: 20px;">
        ${documents.map(doc => `
          <div style="margin-bottom: 15px; padding: 15px; border: 1px solid #ddd; border-radius: 4px; background: #f8f9fa;">
            <div style="display: flex; justify-content: between; align-items: center; margin-bottom: 10px;">
              <strong style="color: #495057;">${doc.name}</strong>
            </div>
            <div style="display: flex; gap: 10px; flex-wrap: wrap;">
              <a href="${directUrl}${doc.path}" target="_blank" 
                 style="color: #007bff; text-decoration: none; padding: 8px 12px; border: 1px solid #007bff; border-radius: 4px; display: inline-block; transition: all 0.2s;"
                 onmouseover="this.style.background='#007bff'; this.style.color='white'"
                 onmouseout="this.style.background='transparent'; this.style.color='#007bff'">
                📄 View ${doc.name}
              </a>
              <a href="${baseUrl}${doc.path}" download 
                 style="color: white; text-decoration: none; padding: 8px 12px; background: #28a745; border: 1px solid #28a745; border-radius: 4px; display: inline-block; transition: all 0.2s;"
                 onmouseover="this.style.background='#218838'; this.style.borderColor='#218838'"
                 onmouseout="this.style.background='#28a745'; this.style.borderColor='#28a745'">
                📥 Download
              </a>
            </div>
          </div>
        `).join('')}
      </div>
      <div style="text-align: right; border-top: 1px solid #ddd; padding-top: 15px;">
        <button id="closeModal" style="padding: 10px 20px; background: #6c757d; color: white; border: none; border-radius: 4px; cursor: pointer; transition: background 0.2s;"
                onmouseover="this.style.background='#5a6268'"
                onmouseout="this.style.background='#6c757d'">
          Close
        </button>
      </div>
    `;

    modal.appendChild(modalContent);
    document.body.appendChild(modal);

    // Close modal functionality
    const closeModal = () => {
      document.body.removeChild(modal);
    };

    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeModal();
    });

    modalContent.querySelector('#closeModal')?.addEventListener('click', closeModal);

    // Close on Escape key
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closeModal();
        document.removeEventListener('keydown', handleEscape);
      }
    };
    document.addEventListener('keydown', handleEscape);
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