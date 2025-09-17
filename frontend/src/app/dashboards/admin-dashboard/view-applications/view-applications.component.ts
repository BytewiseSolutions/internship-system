import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms'; 

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
  apiUrl = 'http://localhost:8081/applications';

  filterInternship: string = '';
  filterStatus: string = '';

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.loadApplications();
  }

  loadApplications(): void {
    this.http.get<any>(`${this.apiUrl}/view_applications.php`)
      .subscribe({
        next: (res) => {
          this.applications = res.applications;
          this.filteredApplications = [...this.applications];
          this.loading = false;
        },
        error: (err) => {
          console.error('Error fetching applications', err);
          this.error = 'Could not load applications';
          this.loading = false;
        }
      });
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
}
