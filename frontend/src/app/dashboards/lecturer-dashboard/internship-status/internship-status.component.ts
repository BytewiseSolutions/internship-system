import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-internship-status',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './internship-status.component.html',
  styleUrls: ['./internship-status.component.scss']
})
export class InternshipStatusComponent implements OnInit {
  applications: any[] = [];
  loading = true;
  ongoingCount = 0;
  completedCount = 0;
  pendingCount = 0;

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.loadInternshipStatus();
  }

  loadInternshipStatus() {
    this.http.get(`${environment.apiUrl}/applications/get_all_applications.php`)
      .subscribe({
        next: (data: any) => {
          this.applications = Array.isArray(data) ? data : [];
          this.calculateCounts();
          this.loading = false;
        },
        error: (error) => {
          console.error('Error loading internship status:', error);
          this.applications = [];
          this.loading = false;
        }
      });
  }

  calculateCounts() {
    this.ongoingCount = this.applications.filter(app => app.status === 'APPROVED').length;
    this.completedCount = this.applications.filter(app => app.status === 'COMPLETED').length;
    this.pendingCount = this.applications.filter(app => app.status === 'PENDING').length;
  }
}