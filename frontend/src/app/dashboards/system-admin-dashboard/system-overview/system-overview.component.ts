import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-system-overview',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './system-overview.component.html',
  styleUrls: ['./system-overview.component.scss']
})
export class SystemOverviewComponent implements OnInit {
  systemData = {
    totalUsers: 0,
    totalSchools: 0,
    totalCompanies: 0,
    totalApplications: 0,
    activeInternships: 0,
    recentActivities: []
  };
  loading = true;

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.loadSystemOverview();
  }

  loadSystemOverview() {
    // Load all system statistics
    this.http.get(`${environment.apiUrl}/getAllUsers.php`).subscribe({
      next: (users: any) => {
        this.systemData.totalUsers = users.length;
        this.checkLoadingComplete();
      }
    });

    this.http.get(`${environment.apiUrl}/api/schools/get_schools.php`).subscribe({
      next: (schools: any) => {
        this.systemData.totalSchools = schools.length;
        this.checkLoadingComplete();
      }
    });

    this.http.get(`${environment.apiUrl}/company/get_companies.php`).subscribe({
      next: (companies: any) => {
        this.systemData.totalCompanies = companies.length;
        this.checkLoadingComplete();
      }
    });
  }

  checkLoadingComplete() {
    this.loading = false;
  }
}