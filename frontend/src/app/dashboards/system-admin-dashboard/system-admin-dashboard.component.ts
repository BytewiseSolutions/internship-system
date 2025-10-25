import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { SystemAdminHeaderComponent } from '../../components/system-admin/system-admin-header/system-admin-header.component';
import { SystemAdminSidebarComponent } from '../../components/system-admin/system-admin-sidebar/system-admin-sidebar.component';

@Component({
  selector: 'app-system-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, SystemAdminHeaderComponent, SystemAdminSidebarComponent],
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
    this.http.get(`${environment.apiUrl}/api/system/get_system_stats.php`).subscribe({
      next: (stats: any) => {
        this.systemStats = stats;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading system stats:', error);
        this.loading = false;
      }
    });
  }

  onSidebarCollapseChanged(collapsed: boolean) {
    this.isSidebarCollapsed = collapsed;
  }
}