import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
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
  lecturerStats = {
    students: 0,
    courses: 0,
    logbooks: 0,
    applications: 0
  };
  loading = true;

  constructor(private http: HttpClient) {}

  ngOnInit() {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    this.userName = user.name || 'Lecturer';
    this.loadLecturerStats();
  }

  loadLecturerStats() {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    console.log('User from localStorage:', user);
    console.log('API URL:', `${environment.apiUrl}/api/lecturer/get_lecturer_stats.php?user_id=${user.id}`);
    
    this.http.get(`${environment.apiUrl}/api/lecturer/get_lecturer_stats.php?user_id=${user.id}`).subscribe({
      next: (stats: any) => {
        console.log('Lecturer stats response:', stats);
        this.lecturerStats = stats;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading lecturer stats:', error);
        this.loading = false;
      }
    });
  }

  onSidebarCollapseChanged(collapsed: boolean) {
    this.isSidebarCollapsed = collapsed;
  }
}