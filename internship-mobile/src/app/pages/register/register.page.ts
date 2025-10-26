import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { IonContent, IonHeader, IonToolbar, IonTitle, IonButton, IonInput, IonItem, IonLabel, IonIcon, IonBackButton, IonButtons, IonToast, IonSelect, IonSelectOption } from '@ionic/angular/standalone';
import { FormsModule } from '@angular/forms';
import { addIcons } from 'ionicons';
import { personOutline, mailOutline, lockClosedOutline, schoolOutline, bookOutline } from 'ionicons/icons';
import { AuthService } from '../../services/auth.service';
import { DataService } from '../../services/data.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
  standalone: true,
  imports: [CommonModule, IonContent, IonHeader, IonToolbar, IonTitle, IonButton, IonInput, IonItem, IonLabel, IonIcon, IonBackButton, IonButtons, IonToast, IonSelect, IonSelectOption, FormsModule]
})
export class RegisterPage implements OnInit {
  name: string = '';
  email: string = '';
  password: string = '';
  confirmPassword: string = '';
  schoolId: number | null = null;
  courseId: number | null = null;
  isLoading: boolean = false;
  showToast: boolean = false;
  toastMessage: string = '';
  toastColor: string = 'danger';
  schools: any[] = [];
  courses: any[] = [];

  constructor(private router: Router, private authService: AuthService, private dataService: DataService) {
    addIcons({ personOutline, mailOutline, lockClosedOutline, schoolOutline, bookOutline });
  }

  ngOnInit() {
    this.loadSchools();
  }

  loadSchools() {
    this.dataService.getSchools().subscribe({
      next: (response) => {
        if (response.success) {
          this.schools = response.schools;
        } else {
          this.showToastMessage('Failed to load schools', 'danger');
        }
      },
      error: (error) => {
        console.error('Error loading schools:', error);
        this.showToastMessage('Network error loading schools', 'danger');
      }
    });
  }

  onSchoolChange() {
    if (this.schoolId) {
      this.courseId = null;
      this.courses = [];
      this.dataService.getCourses(this.schoolId).subscribe({
        next: (response) => {
          if (response.success) {
            this.courses = response.courses;
          } else {
            this.showToastMessage('Failed to load courses', 'danger');
          }
        },
        error: (error) => {
          console.error('Error loading courses:', error);
          this.showToastMessage('Network error loading courses', 'danger');
        }
      });
    } else {
      this.courses = [];
      this.courseId = null;
    }
  }

  register() {
    if (!this.name || !this.email || !this.password || !this.confirmPassword || !this.schoolId || !this.courseId) {
      this.showToastMessage('Please fill in all fields', 'warning');
      return;
    }

    if (this.password !== this.confirmPassword) {
      this.showToastMessage('Passwords do not match', 'warning');
      return;
    }

    if (this.password.length < 6) {
      this.showToastMessage('Password must be at least 6 characters', 'warning');
      return;
    }

    this.isLoading = true;
    const userData = {
      name: this.name,
      email: this.email,
      password: this.password,
      school_id: this.schoolId,
      course_id: this.courseId
    };

    this.authService.register(userData).subscribe({
      next: (response) => {
        this.isLoading = false;
        if (response.success) {
          this.showToastMessage('Registration successful! Please login.', 'success');
          setTimeout(() => {
            this.router.navigate(['/login']);
          }, 1500);
        } else {
          this.showToastMessage(response.message || 'Registration failed', 'danger');
        }
      },
      error: (error) => {
        this.isLoading = false;
        this.showToastMessage('Network error. Please try again.', 'danger');
      }
    });
  }

  goToLogin() {
    this.router.navigate(['/login']);
  }

  private showToastMessage(message: string, color: string) {
    this.toastMessage = message;
    this.toastColor = color;
    this.showToast = true;
  }
}