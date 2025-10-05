import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-view-applications',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './view-applications.component.html',
  styleUrls: ['./view-applications.component.scss']
})
export class ViewApplicationsComponent implements OnInit {
  applications: any[] = [];
  filteredApplications: any[] = [];
  loading = true;
  error: string | null = null;

  private baseUrl = environment.apiUrl;

  filterInternship: string = '';
  filterStatus: string = '';

  stats = {
    total: 0,
    pending: 0,
    approved: 0,
    rejected: 0
  };

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.loadApplications();
  }

  loadApplications(): void {
    this.http.get<any>(`${this.baseUrl}/applications/view_applications.php`)
      .subscribe({
        next: (res) => {
          this.applications = res.applications || [];
          this.filteredApplications = [...this.applications];
          this.calculateStats();
          this.loading = false;
        },
        error: (err) => {
          console.error('Error fetching applications', err);
          this.error = 'Could not load applications. Please try again later.';
          this.loading = false;
        }
      });
  }

  calculateStats(): void {
    this.stats.total = this.applications.length;
    this.stats.pending = this.applications.filter(app => app.status === 'PENDING').length;
    this.stats.approved = this.applications.filter(app => app.status === 'APPROVED').length;
    this.stats.rejected = this.applications.filter(app => app.status === 'REJECTED').length;
  }

  filterApplications(): void {
    this.filteredApplications = this.applications.filter(app => {
      const matchesInternship = this.filterInternship
        ? app.internship_title.toLowerCase().includes(this.filterInternship.toLowerCase())
        : true;

      const matchesStatus = this.filterStatus
        ? app.status.toLowerCase() === this.filterStatus.toLowerCase()
        : true;

      return matchesInternship && matchesStatus;
    });
  }

  getStatusClass(status: string): string {
    return status.toLowerCase();
  }
}
