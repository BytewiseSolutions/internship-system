import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-view-students',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './view-students.component.html',
  styleUrls: ['./view-students.component.scss']
})
export class ViewStudentsComponent implements OnInit {
  students: any[] = [];
  filteredStudents: any[] = [];
  loading = true;
  searchTerm = '';

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.loadStudents();
  }

  loadStudents() {
    this.http.get(`${environment.apiUrl}/api/lecturer/get_students_with_status.php`)
      .subscribe({
        next: (data: any) => {
          this.students = data;
          this.filteredStudents = this.students;
          this.loading = false;
        },
        error: (error) => {
          console.error('Error loading students:', error);
          this.loading = false;
        }
      });
  }

  updateStudentStatuses() {
    // Check each student's application status
    const promises = this.students.map(student => 
      this.http.get(`${environment.apiUrl}/applications/get_student_applications.php?user_id=${student.user_id}`).toPromise()
    );

    Promise.all(promises).then(results => {
      results.forEach((result: any, index) => {
        if (result && result.length > 0) {
          const app = result[0]; // Get first application
          if (app.status === 'ACCEPTED') {
            this.students[index].internship_status = 'Active Internship';
            this.students[index].company_name = app.company_name || 'Company';
          } else if (app.status === 'PENDING') {
            this.students[index].internship_status = 'Application Pending';
          } else if (app.status === 'REJECTED') {
            this.students[index].internship_status = 'Application Rejected';
          }
        }
      });
      this.filteredStudents = this.students;
      this.loading = false;
    }).catch(error => {
      console.error('Error updating student statuses:', error);
      this.filteredStudents = this.students;
      this.loading = false;
    });
  }

  searchStudents() {
    if (!this.searchTerm) {
      this.filteredStudents = this.students;
    } else {
      this.filteredStudents = this.students.filter(student => 
        student.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        student.student_id.toString().includes(this.searchTerm) ||
        student.course_name.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    }
  }
}