import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-employer-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './employer-header.component.html',
  styleUrls: ['./employer-header.component.scss']
})
export class EmployerHeaderComponent {
  @Input() isSidebarCollapsed = false;
}