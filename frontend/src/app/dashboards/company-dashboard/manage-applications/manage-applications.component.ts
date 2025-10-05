import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';

interface Application {
  application_id: number;
  student_name: string;
  student_email: string;
  internship_title: string;
  cvPath?: string;
  transcriptPath?: string;
  applicationLetterPath?: string;
  status: string;
}

@Component({
  selector: 'app-manage-applications',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './manage-applications.component.html',
  styleUrls: ['./manage-applications.component.scss']
})
export class ManageApplicationsComponent implements OnInit {
  applications: Application[] = [];
  statuses = ['PENDING', 'ACCEPTED', 'REJECTED'];
  loading = true;
  error: string | null = null;

  constructor(private http: HttpClient) { }

  ngOnInit() {
    this.loadApplications();
  }

  loadApplications() {
    this.loading = true;
    this.error = null;

    this.http.get<any>(`${environment.apiUrl}/backend/applications/get_all_applications.php`)
      .subscribe({
        next: (res) => {
          if (res.status === 'success') {
            this.applications = res.applications;
          } else {
            this.error = res.message || 'Failed to load applications';
          }
          this.loading = false;
        },
        error: (err) => {
          console.error('Failed to load applications:', err);
          this.error = 'Failed to load applications. Please try again.';
          this.loading = false;
        }
      });
  }

  getStatusCount(status: string): number {
    return this.applications.filter(app => app.status === status).length;
  }

  updateStatus(application: Application, newStatus: string) {
    const payload = { id: application.application_id, status: newStatus };
    this.http.post(`${environment.apiUrl}/backend/applications/update_application_status.php`, payload)
      .subscribe({
        next: () => {
          application.status = newStatus;
          console.log(`Application ${application.application_id} status updated to ${newStatus}`);
        },
        error: (err) => {
          console.error('Failed to update status:', err);
          this.loadApplications();
        }
      });
  }

  downloadFile(path: string | undefined) {
    if (!path) return;
    window.open(`${environment.apiUrl}/${path}`, '_blank');
  }

  getTotalApplications(): number {
    return this.applications.length;
  }
}