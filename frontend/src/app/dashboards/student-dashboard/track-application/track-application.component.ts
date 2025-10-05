import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { RouterModule } from '@angular/router';

interface Application {
  id: number;
  internship_title: string;
  status: string;
  submitted_at: string;
}

@Component({
  selector: 'app-track-application',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './track-application.component.html',
  styleUrls: ['./track-application.component.scss']
})
export class TrackApplicationComponent implements OnInit {
  applications: Application[] = [];
  loading = true;
  error: string | null = null;
  apiUrl = 'http://localhost:8081/applications';

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.loadApplications();
  }

  loadApplications(): void {
    this.loading = true;
    this.error = null;

    const student = JSON.parse(localStorage.getItem('user') || '{}');
    if (!student || student.role !== 'STUDENT') {
      this.error = 'You must be logged in as a student to view applications.';
      this.loading = false;
      return;
    }

    this.http.get<Application[]>(`${this.apiUrl}/track_applications.php?student_id=${student.id}`)
      .subscribe({
        next: (res) => {
          this.applications = res;
          this.loading = false;
        },
        error: (err) => {
          console.error('Error fetching applications', err);
          this.error = 'Could not load applications. Please try again.';
          this.loading = false;
        }
      });
  }

  getStatusClass(status: string): string {
    const statusMap: { [key: string]: string } = {
      'Pending': 'status-pending',
      'Approved': 'status-approved',
      'Rejected': 'status-rejected',
      'Under Review': 'status-review',
      'Shortlisted': 'status-shortlisted'
    };
    return statusMap[status] || 'status-default';
  }

  getStatusIcon(status: string): string {
    const iconMap: { [key: string]: string } = {
      'Pending': 'fas fa-clock',
      'Approved': 'fas fa-check-circle',
      'Rejected': 'fas fa-times-circle',
      'Under Review': 'fas fa-search',
      'Shortlisted': 'fas fa-star'
    };
    return iconMap[status] || 'fas fa-question-circle';
  }
}