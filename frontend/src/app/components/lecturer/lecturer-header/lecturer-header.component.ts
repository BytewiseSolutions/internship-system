import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-lecturer-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './lecturer-header.component.html',
  styleUrls: ['./lecturer-header.component.scss']
})
export class LecturerHeaderComponent {
  @Input() isSidebarCollapsed = false;
}