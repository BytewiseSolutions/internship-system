import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-school-admin-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './school-admin-header.component.html',
  styleUrls: ['./school-admin-header.component.scss']
})
export class SchoolAdminHeaderComponent {
  @Input() isSidebarCollapsed = false;
}