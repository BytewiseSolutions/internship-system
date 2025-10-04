import { Component, OnInit } from '@angular/core';
import { CompanyHeaderComponent } from '../../components/company/company-header/company-header.component';
import { CompanySidebarComponent } from '../../components/company/company-sidebar/company-sidebar.component';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { DashboardService } from '../../services/dashboard.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-company-dashboard',
  standalone: true,
  imports: [CommonModule, CompanyHeaderComponent, CompanySidebarComponent],
  templateUrl: './company-dashboard.component.html',
  styleUrls: ['./company-dashboard.component.scss']
})
export class CompanyDashboardComponent implements OnInit {
  isSidebarCollapsed = false;
  totalInternships = 0;
  totalApplications = 0;
  totalReviews = 0;
  approvedStudents = 0;

  recentInternships: any[] = [];
  recentApplications: any[] = [];

  constructor(
    private authService: AuthService,
    private router: Router,
    private dashboardService: DashboardService
  ) { }
  ngOnInit(): void {
    const companyId = this.authService.getCompanyId();
    console.log('Company ID retrieved:', companyId);
    
    if (!companyId) {
      console.error('Company ID is invalid');
      return;
    }

    this.dashboardService.getCompanyStats(companyId).subscribe({
      next: (stats: any) => {
        this.totalInternships = stats.totalInternships;
        this.totalApplications = stats.totalApplications;
        this.totalReviews = stats.totalReviews;
        this.approvedStudents = stats.approvedStudents;
      },
      error: (err) => console.error('Error loading stats:', err)
    });

    this.dashboardService.getRecentInternships(companyId).subscribe({
      next: (data) => this.recentInternships = data,
      error: (err) => console.error('Error loading internships:', err)
    });
    
    this.dashboardService.getRecentApplications(companyId).subscribe({
      next: (data) => this.recentApplications = data,
      error: (err) => console.error('Error loading applications:', err)
    });
  }
  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  onSidebarCollapseChanged(collapsed: boolean) {
    this.isSidebarCollapsed = collapsed;
  }
}
