import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
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

  constructor() { }

  ngOnInit(): void {
    this.loadDashboardData();
  }

  onSidebarCollapseChanged(collapsed: boolean): void {
    this.isSidebarCollapsed = collapsed;
  }

  private loadDashboardData(): void {
    // Load dashboard statistics
    this.totalInternships = 12;
    this.totalApplications = 45;
    this.approvedStudents = 8;
    this.totalReviews = 3;
  }
}