import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { SchoolAdminHeaderComponent } from '../../components/school-admin/school-admin-header/school-admin-header.component';
import { SchoolAdminSidebarComponent } from '../../components/school-admin/school-admin-sidebar/school-admin-sidebar.component';

@Component({
  selector: 'app-school-admin-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, SchoolAdminHeaderComponent, SchoolAdminSidebarComponent],
  templateUrl: './school-admin-dashboard.component.html',
  styleUrls: ['./school-admin-dashboard.component.scss']
})
export class SchoolAdminDashboardComponent implements OnInit {
  isSidebarCollapsed = false;
  userName = '';
  schoolName = '';
  schoolStats = {
    courses: 0,
    lecturers: 0,
    students: 0,
    applications: 0
  };
  loading = true;
  currentView = 'dashboard';
  courses: any[] = [];
  showAddCourseForm = false;
  newCourse = {
    course_name: ''
  };
  lecturers: any[] = [];
  showAddLecturerForm = false;
  newLecturer = {
    name: '',
    email: ''
  };
  showAssignCourseForm = false;
  selectedLecturer: any = null;
  assignmentData = {
    course_id: ''
  };
  students: any[] = [];
  showAddStudentForm = false;
  newStudent = {
    name: '',
    email: '',
    course_id: ''
  };

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit() {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    this.userName = user.name || 'School Admin';
    this.loadSchoolStats();
    this.setCurrentView();
    if (this.currentView === 'courses') {
      this.loadCourses();
    } else if (this.currentView === 'lecturers') {
      this.loadLecturers();
    } else if (this.currentView === 'students') {
      this.loadStudents();
      this.loadCourses();
    }
  }

  setCurrentView() {
    const url = this.router.url;
    if (url.includes('manage-courses')) {
      this.currentView = 'courses';
      this.loadCourses();
    } else if (url.includes('manage-lecturers')) {
      this.currentView = 'lecturers';
      this.loadLecturers();
      this.loadCourses();
    } else if (url.includes('manage-students')) {
      this.currentView = 'students';
      this.loadStudents();
      this.loadCourses();
    } else if (url.includes('school-reports')) {
      this.currentView = 'reports';
    } else {
      this.currentView = 'dashboard';
    }
  }

  loadSchoolStats() {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    this.http.get(`${environment.apiUrl}/api/school/get_school_stats.php?school_id=${user.school_id}`).subscribe({
      next: (stats: any) => {
        this.schoolStats = stats.stats;
        this.schoolName = stats.school_name;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading school stats:', error);
        this.loading = false;
      }
    });
  }

  onSidebarCollapseChanged(collapsed: boolean) {
    this.isSidebarCollapsed = collapsed;
  }

  loadCourses() {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    this.http.get(`${environment.apiUrl}/api/schools/get_courses.php?school_id=${user.school_id}`).subscribe({
      next: (data: any) => {
        this.courses = data;
      },
      error: (error) => {
        console.error('Error loading courses:', error);
      }
    });
  }

  addCourse() {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const courseData = {
      ...this.newCourse,
      school_id: user.school_id
    };

    this.http.post(`${environment.apiUrl}/api/courses/add_course.php`, courseData).subscribe({
      next: (response: any) => {
        if (response.success) {
          alert('Course added successfully!');
          this.loadCourses();
          this.resetCourseForm();
        }
      },
      error: (error) => {
        console.error('Error adding course:', error);
        alert('Error adding course');
      }
    });
  }

  deleteCourse(courseId: number) {
    if (confirm('Are you sure you want to delete this course?')) {
      this.http.delete(`${environment.apiUrl}/api/courses/delete_course.php?id=${courseId}`).subscribe({
        next: (response: any) => {
          if (response.success) {
            alert('Course deleted successfully!');
            this.loadCourses();
          }
        },
        error: (error) => {
          console.error('Error deleting course:', error);
          alert('Error deleting course');
        }
      });
    }
  }

  resetCourseForm() {
    this.newCourse = {
      course_name: ''
    };
    this.showAddCourseForm = false;
  }

  closeCourseModal() {
    this.showAddCourseForm = false;
  }

  loadLecturers() {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    this.http.get(`${environment.apiUrl}/api/lecturers/get_lecturers.php?school_id=${user.school_id}`).subscribe({
      next: (data: any) => {
        this.lecturers = data;
      },
      error: (error) => {
        console.error('Error loading lecturers:', error);
      }
    });
  }

  addLecturer() {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const lecturerData = {
      ...this.newLecturer,
      school_id: user.school_id
    };

    this.http.post(`${environment.apiUrl}/api/lecturers/add_lecturer.php`, lecturerData).subscribe({
      next: (response: any) => {
        if (response.success) {
          alert('Lecturer added successfully!');
          this.loadLecturers();
          this.resetLecturerForm();
        }
      },
      error: (error) => {
        console.error('Error adding lecturer:', error);
        alert('Error adding lecturer');
      }
    });
  }

  deleteLecturer(lecturerId: number) {
    if (confirm('Are you sure you want to delete this lecturer?')) {
      this.http.delete(`${environment.apiUrl}/api/lecturers/delete_lecturer.php?id=${lecturerId}`).subscribe({
        next: (response: any) => {
          if (response.success) {
            alert('Lecturer deleted successfully!');
            this.loadLecturers();
          }
        },
        error: (error) => {
          console.error('Error deleting lecturer:', error);
          alert('Error deleting lecturer');
        }
      });
    }
  }

  resetLecturerForm() {
    this.newLecturer = {
      name: '',
      email: ''
    };
    this.showAddLecturerForm = false;
  }

  closeLecturerModal() {
    this.showAddLecturerForm = false;
  }

  assignCourse(lecturer: any) {
    this.selectedLecturer = lecturer;
    this.loadCourses();
    this.showAssignCourseForm = true;
  }

  submitCourseAssignment() {
    const assignData = {
      lecturer_id: this.selectedLecturer.lecturer_id,
      course_id: this.assignmentData.course_id
    };

    this.http.post(`${environment.apiUrl}/api/lecturers/assign_course.php`, assignData).subscribe({
      next: (response: any) => {
        if (response.success) {
          alert('Course assigned successfully!');
          this.loadLecturers();
          this.closeAssignModal();
        }
      },
      error: (error) => {
        console.error('Error assigning course:', error);
        alert('Error assigning course');
      }
    });
  }

  closeAssignModal() {
    this.showAssignCourseForm = false;
    this.selectedLecturer = null;
    this.assignmentData = {
      course_id: ''
    };
  }

  loadStudents() {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    this.http.get(`${environment.apiUrl}/api/students/get_students.php?school_id=${user.school_id}`).subscribe({
      next: (data: any) => {
        this.students = data;
      },
      error: (error) => {
        console.error('Error loading students:', error);
      }
    });
  }

  addStudent() {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const studentData = {
      ...this.newStudent,
      school_id: user.school_id
    };

    this.http.post(`${environment.apiUrl}/api/students/add_student.php`, studentData).subscribe({
      next: (response: any) => {
        if (response.success) {
          alert('Student added successfully!');
          this.loadStudents();
          this.resetStudentForm();
        }
      },
      error: (error) => {
        console.error('Error adding student:', error);
        alert('Error adding student');
      }
    });
  }

  deleteStudent(studentId: number) {
    if (confirm('Are you sure you want to delete this student?')) {
      this.http.delete(`${environment.apiUrl}/api/students/delete_student.php?id=${studentId}`).subscribe({
        next: (response: any) => {
          if (response.success) {
            alert('Student deleted successfully!');
            this.loadStudents();
          }
        },
        error: (error) => {
          console.error('Error deleting student:', error);
          alert('Error deleting student');
        }
      });
    }
  }

  resetStudentForm() {
    this.newStudent = {
      name: '',
      email: '',
      course_id: ''
    };
    this.showAddStudentForm = false;
  }

  closeStudentModal() {
    this.showAddStudentForm = false;
  }
}