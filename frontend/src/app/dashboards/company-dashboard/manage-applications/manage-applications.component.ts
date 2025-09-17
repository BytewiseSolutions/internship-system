import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

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

  constructor(private http: HttpClient) { }

  ngOnInit() {
    this.loadApplications();
  }

  loadApplications() {
    this.http.get<any>('http://localhost:8081/applications/get_all_applications.php')
      .subscribe({
        next: (res) => {
          if (res.status === 'success') {
            this.applications = res.applications;
          } else {
            console.error('Error fetching applications:', res.message);
          }
        },
        error: (err) => {
          console.error('Failed to load applications:', err);
        }
      });
  }

  updateStatus(application: Application, newStatus: string) {
    const payload = { id: application.application_id, status: newStatus };
    this.http.post('http://localhost:8081/applications/update_application_status.php', payload)
      .subscribe({
        next: () => {
          application.status = newStatus;
          console.log(`Application ${application.application_id} status updated to ${newStatus}`);
        },
        error: (err) => {
          console.error('Failed to update status:', err);
        }
      });
  }

  downloadFile(path: string | undefined) {
    if (!path) return;
    window.open(`http://localhost:8081/${path}`, '_blank');
  }

}
