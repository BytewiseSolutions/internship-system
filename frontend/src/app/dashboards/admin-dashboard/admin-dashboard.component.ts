import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AdminSidebarComponent } from "../../components/admin/admin-sidebar/admin-sidebar.component";

import { HttpClient } from '@angular/common/http';
import { AdminHeaderComponent } from '../../components/admin/admin-header/admin-header.component';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [AdminSidebarComponent, AdminHeaderComponent],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.scss'
})
export class AdminDashboardComponent implements OnInit {
  isSidebarCollapsed = false;

  totalUsers: number = 0;
  pendingUsers: number = 0;
  activeUsers: number = 0;
  totalCompanies: number = 0;

  constructor(
    private authService: AuthService,
    private router: Router,
    private http: HttpClient
  ) { }

  ngOnInit(): void {
    this.fetchUserStats();
  }
  fetchUserStats() {
    this.http.get<any[]>('http://localhost:8081/auth/all_users.php').subscribe(users => {
      this.totalUsers = users.length;
      this.pendingUsers = users.filter(user => user.status === 'PENDING').length;
      this.activeUsers = users.filter(user => user.status === 'ACTIVE').length;
      this.totalCompanies = users.filter(user => user.role === 'COMPANY').length;
    }, error => {
      console.error('Failed to fetch users:', error);
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
