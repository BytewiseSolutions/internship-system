import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { SystemAdminHeaderComponent } from '../../components/system-admin/system-admin-header/system-admin-header.component';
import { SystemAdminSidebarComponent } from '../../components/system-admin/system-admin-sidebar/system-admin-sidebar.component';

@Component({
  selector: 'app-system-admin-dashboard',
  standalone: true,
  imports: [CommonModule, SystemAdminHeaderComponent, SystemAdminSidebarComponent],
  templateUrl: './system-admin-dashboard.component.html',
  styleUrls: ['./system-admin-dashboard.component.scss']
})
export class SystemAdminDashboardComponent implements OnInit {
  isSidebarCollapsed = false;
  userName = '';
  systemStats = {
    schools: 0,
    companies: 0,
    users: 0,
    applications: 0
  };
  loading = true;

  constructor(private http: HttpClient) {}

  ngOnInit() {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    this.userName = user.name || 'System Admin';
    this.loadSystemStats();
  }

  loadSystemStats() {
    // Load schools count
    this.http.get(`${environment.apiUrl}/api/schools/get_schools.php`).subscribe({
      next: (schools: any) => {
        this.systemStats.schools = schools.length;
      },
      error: (error) => console.error('Error loading schools:', error)
    });

    // Load users count
    this.http.get(`${environment.apiUrl}/getAllUsers.php`).subscribe({
      next: (users: any) => {
        this.systemStats.users = users.length;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading users:', error);
        this.loading = false;
      }
    });
  }

  onSidebarCollapseChanged(collapsed: boolean) {
    this.isSidebarCollapsed = collapsed;
  }
}