import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { SystemAdminHeaderComponent } from '../../components/system-admin/system-admin-header/system-admin-header.component';
import { SystemAdminSidebarComponent } from '../../components/system-admin/system-admin-sidebar/system-admin-sidebar.component';

@Component({
  selector: 'app-system-admin-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, SystemAdminHeaderComponent, SystemAdminSidebarComponent],
  templateUrl: './system-admin-layout.component.html',
  styleUrls: ['./system-admin-layout.component.scss']
})
export class SystemAdminLayoutComponent {
  isSidebarCollapsed = false;

  onSidebarCollapseChanged(collapsed: boolean) {
    this.isSidebarCollapsed = collapsed;
  }
}