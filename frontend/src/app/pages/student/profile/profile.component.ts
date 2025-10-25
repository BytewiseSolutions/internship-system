import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { StudentHeaderComponent } from '../../../components/student/student-header/student-header.component';
import { StudentSidebarComponent } from '../../../components/student/student-sidebar/student-sidebar.component';

interface StudentProfile {
  user_id: number;
  name: string;
  email: string;
  student_id: number;
  course_id: number;
  course_name: string;
}

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule, StudentHeaderComponent, StudentSidebarComponent],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  isSidebarCollapsed = false;
  profile: StudentProfile | null = null;
  loading = true;
  error = '';
  editing = false;
  saving = false;

  editForm = {
    name: '',
    email: '',
    course: 1
  };

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.loadProfile();
  }

  onSidebarCollapseChanged(collapsed: boolean) {
    this.isSidebarCollapsed = collapsed;
  }

  loadProfile() {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const userId = user.id;
    if (!userId) {
      this.error = 'User not found';
      this.loading = false;
      return;
    }

    this.http.get<any>(`${environment.apiUrl}/students/get_student_profile.php?user_id=${userId}`)
      .subscribe({
        next: (response) => {
          if (response.success) {
            this.profile = response.profile;
            this.populateEditForm();
          } else {
            this.error = response.message;
          }
          this.loading = false;
        },
        error: (err) => {
          this.error = 'Failed to load profile';
          this.loading = false;
        }
      });
  }

  populateEditForm() {
    if (this.profile) {
      this.editForm = {
        name: this.profile.name,
        email: this.profile.email,
        course: this.profile.course_id || 1
      };
    }
  }

  startEdit() {
    this.editing = true;
    this.populateEditForm();
  }

  cancelEdit() {
    this.editing = false;
    this.populateEditForm();
  }

  saveProfile() {
    if (!this.profile) return;
    
    this.saving = true;
    const payload = {
      user_id: this.profile.user_id,
      ...this.editForm
    };

    this.http.put<any>(`${environment.apiUrl}/students/update_student_profile.php`, payload)
      .subscribe({
        next: (response) => {
          if (response.success) {
            this.editing = false;
            this.loadProfile();
          } else {
            this.error = response.message;
          }
          this.saving = false;
        },
        error: (err) => {
          this.error = 'Failed to update profile';
          this.saving = false;
        }
      });
  }
}