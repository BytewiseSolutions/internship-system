import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { environment } from '../../../../environments/environment';
import { StudentHeaderComponent } from '../../../components/student/student-header/student-header.component';
import { StudentSidebarComponent } from '../../../components/student/student-sidebar/student-sidebar.component';

interface Internship {
  application_id: number;
  status: string;
  applied_at: string;
  internship_id: number;
  internship_title: string;
  internship_description: string;
  location: string;
  deadline: string;
  company_id: number;
  company_name: string;
  company_email: string;
  company_address: string;
}

@Component({
  selector: 'app-my-internship',
  standalone: true,
  imports: [CommonModule, StudentHeaderComponent, StudentSidebarComponent, RouterModule],
  templateUrl: './my-internship.component.html',
  styleUrls: ['./my-internship.component.scss']
})
export class MyInternshipComponent implements OnInit {
  isSidebarCollapsed = false;
  internship: Internship | null = null;
  loading = true;
  error = '';
  private _progress: number = 0;

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.loadInternship();
  }

  onSidebarCollapseChanged(collapsed: boolean) {
    this.isSidebarCollapsed = collapsed;
  }

  loadInternship() {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const userId = user.id;
    if (!userId) {
      this.error = 'User not found';
      this.loading = false;
      return;
    }

    this.http.get<any>(`${environment.apiUrl}/applications/get_student_internship.php?user_id=${userId}`)
      .subscribe({
        next: (response) => {
          if (response.success) {
            this.internship = response.internship;
            this._progress = this.calculateProgress();
          } else {
            this.error = response.message;
          }
          this.loading = false;
        },
        error: (err) => {
          this.error = 'Failed to load internship';
          this.loading = false;
        }
      });
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString();
  }

  getDaysRemaining(): number {
    if (!this.internship) return 0;
    const deadline = new Date(this.internship.deadline);
    const today = new Date();
    const diffTime = deadline.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  getProgress(): number {
    return this._progress;
  }

  private calculateProgress(): number {
    if (!this.internship) return 0;
    const appliedDate = new Date(this.internship.applied_at);
    const deadline = new Date(this.internship.deadline);
    const today = new Date();
    
    const totalDays = deadline.getTime() - appliedDate.getTime();
    const elapsedDays = today.getTime() - appliedDate.getTime();
    
    return Math.max(0, Math.min(100, (elapsedDays / totalDays) * 100));
  }
}