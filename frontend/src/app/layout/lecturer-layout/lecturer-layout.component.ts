import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { LecturerHeaderComponent } from '../../components/lecturer/lecturer-header/lecturer-header.component';
import { LecturerSidebarComponent } from '../../components/lecturer/lecturer-sidebar/lecturer-sidebar.component';

@Component({
  selector: 'app-lecturer-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, LecturerHeaderComponent, LecturerSidebarComponent],
  templateUrl: './lecturer-layout.component.html',
  styleUrls: ['./lecturer-layout.component.scss']
})
export class LecturerLayoutComponent {
  isSidebarCollapsed = false;

  onSidebarCollapseChanged(collapsed: boolean) {
    this.isSidebarCollapsed = collapsed;
  }
}