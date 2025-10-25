import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ToastService } from '../../services/toast.service';
import { AuthService } from '../../services/auth.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  student = {
    name: '',
    email: '',
    contact: '',
    password: '',
    school_id: '',
    course_id: '',
    role: 'STUDENT'
  };

  schools: any[] = [];
  courses: any[] = [];

  message = '';
  isSuccess = false;
  showMessage = false;
  loading = false;

  constructor(
    private authService: AuthService,
    private router: Router, 
    private toast: ToastService,
    private http: HttpClient
  ) { }

  ngOnInit() {
    this.loadSchools();
  }

  loadSchools() {
    this.http.get('http://localhost:8000/api/schools/get_schools.php')
      .subscribe({
        next: (response: any) => {
          this.schools = response.schools || [];
        },
        error: (error) => {
          console.error('Error loading schools:', error);
        }
      });
  }

  onSchoolChange() {
    if (this.student.school_id) {
      this.loadCourses(this.student.school_id);
    }
    this.student.course_id = '';
  }

  loadCourses(schoolId: string) {
    this.http.get(`http://localhost:8000/api/courses/get_courses.php?school_id=${schoolId}`)
      .subscribe({
        next: (response: any) => {
          this.courses = response.courses || [];
        },
        error: (error) => {
          console.error('Error loading courses:', error);
        }
      });
  }

  register() {
    this.authService.register(this.student).subscribe({
      next: () => {
        this.toast.show('Registration Successful! Redirecting to login...', 'success');
        setTimeout(() => this.router.navigate(['/login']), 5000);
      },
      error: err => {
        const errorMsg = err.error?.message || 'Registration failed! Try again.';
        this.toast.show(errorMsg, 'error');
      }
    });
  }
}
