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
    this.http.get(`${environment.apiUrl}/getAllUsers.php`)
      .subscribe({
        next: (data: any) => {
          this.students = data.filter((user: any) => user.role === 'STUDENT');
          this.filteredStudents = this.students;
          this.loading = false;
        },
        error: (error) => {
          console.error('Error loading students:', error);
          this.loading = false;
        }
      });
  }

  searchStudents() {
    if (!this.searchTerm) {
      this.filteredStudents = this.students;
    } else {
      this.filteredStudents = this.students.filter(student => 
        student.id.toString().includes(this.searchTerm)
      );
    }
  }
}