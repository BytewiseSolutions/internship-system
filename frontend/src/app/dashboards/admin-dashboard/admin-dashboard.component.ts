import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AdminSidebarComponent } from "../../components/admin/admin-sidebar/admin-sidebar.component";
import { AdminHeaderComponent } from '../../components/admin/admin-header/admin-header.component';
import { AuthService } from '../../services/auth.service';
import { UserService } from '../../services/user.service';
import { User } from '../../services/user.service';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [AdminSidebarComponent, AdminHeaderComponent],
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.scss'] 
})
export class AdminDashboardComponent implements OnInit {
  isSidebarCollapsed = false;

  totalUsers = 0;
  pendingUsers = 0;
  activeUsers = 0;
  totalCompanies = 0;

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.fetchUserStats();
  }

  fetchUserStats(): void {
    const token = this.authService.getToken();

    if (!token) {
      console.error('No token found. Redirecting to login.');
      this.router.navigate(['/login']);
      return;
    }

    this.userService.getAllUsers(token).subscribe({
      next: (users: User[]) => {
        this.totalUsers = users.length;
        this.pendingUsers = users.filter(u => u.status === 'PENDING').length;
        this.activeUsers = users.filter(u => u.status === 'ACTIVE').length;
        this.totalCompanies = users.filter(u => u.role === 'COMPANY').length;
      },
      error: (err) => {
        console.error('Failed to fetch users:', err);
      }
    });
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  onSidebarCollapseChanged(collapsed: boolean): void {
    this.isSidebarCollapsed = collapsed;
  }
}
