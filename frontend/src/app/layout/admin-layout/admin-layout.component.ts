import { Component } from '@angular/core';
import { AdminSidebarComponent } from '../../components/admin/admin-sidebar/admin-sidebar.component';
import { RouterOutlet } from '@angular/router';
import { AdminHeaderComponent } from '../../components/admin/admin-header/admin-header.component';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [AdminSidebarComponent, AdminHeaderComponent, RouterOutlet],
  templateUrl: './admin-layout.component.html',
  styleUrls: ['./admin-layout.component.scss']
})
export class AdminLayoutComponent {
  isSidebarCollapsed = false;

  onSidebarCollapseChanged(collapsed: boolean) {
    this.isSidebarCollapsed = collapsed;
  }
}
