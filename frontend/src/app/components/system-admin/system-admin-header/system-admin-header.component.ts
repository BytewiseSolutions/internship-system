import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-system-admin-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './system-admin-header.component.html',
  styleUrls: ['./system-admin-header.component.scss']
})
export class SystemAdminHeaderComponent {
  @Input() isSidebarCollapsed = false;
}