import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LecturerHeaderComponent } from '../../components/lecturer/lecturer-header/lecturer-header.component';
import { LecturerSidebarComponent } from '../../components/lecturer/lecturer-sidebar/lecturer-sidebar.component';

@Component({
  selector: 'app-lecturer-dashboard',
  standalone: true,
  imports: [CommonModule, LecturerHeaderComponent, LecturerSidebarComponent],
  templateUrl: './lecturer-dashboard.component.html',
  styleUrls: ['./lecturer-dashboard.component.scss']
})
export class LecturerDashboardComponent implements OnInit {
  isSidebarCollapsed = false;
  userName = '';

  ngOnInit() {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    this.userName = user.name || 'Lecturer';
  }

  onSidebarCollapseChanged(collapsed: boolean) {
    this.isSidebarCollapsed = collapsed;
  }
}