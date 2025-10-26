import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { EmployerSidebarComponent } from '../../components/employer/employer-sidebar/employer-sidebar.component';
import { EmployerHeaderComponent } from '../../components/employer/employer-header/employer-header.component';

@Component({
  selector: 'app-employer-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, EmployerSidebarComponent, EmployerHeaderComponent],
  templateUrl: './employer-dashboard.component.html',
  styleUrls: ['./employer-dashboard.component.scss']
})
export class EmployerDashboardComponent implements OnInit {
  isSidebarCollapsed = false;
  userName = 'Company Admin';
  totalInternships = 0;
  totalApplications = 0;
  approvedStudents = 0;
  totalReviews = 0;

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.loadDashboardData();
  }

  onSidebarCollapseChanged(collapsed: boolean): void {
    this.isSidebarCollapsed = collapsed;
  }

  private loadDashboardData(): void {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const companyId = user.company_id;
    
    if (!companyId) {
      // New employer with no company_id - show zeros
      this.totalInternships = 0;
      this.totalApplications = 0;
      this.approvedStudents = 0;
      this.totalReviews = 0;
      return;
    }
    
    this.http.get(`${environment.apiUrl}/company/company_stats.php?company_id=${companyId}`)
      .subscribe({
        next: (data: any) => {
          this.totalInternships = data.totalInternships || 0;
          this.totalApplications = data.totalApplications || 0;
          this.approvedStudents = data.approvedStudents || 0;
          this.totalReviews = data.totalReviews || 0;
        },
        error: (error) => {
          console.error('Error loading company stats:', error);
          // Show zeros on error
          this.totalInternships = 0;
          this.totalApplications = 0;
          this.approvedStudents = 0;
          this.totalReviews = 0;
        }
      });
  }
}