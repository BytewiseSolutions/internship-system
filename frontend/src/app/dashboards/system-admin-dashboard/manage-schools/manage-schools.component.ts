import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-manage-schools',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './manage-schools.component.html',
  styleUrls: ['./manage-schools.component.scss']
})
export class ManageSchoolsComponent implements OnInit {
  schools: any[] = [];
  loading = true;
  showAddForm = false;
  showEditForm = false;
  newSchool = {
    name: '',
    address: ''
  };
  editSchoolData = {
    school_id: 0,
    name: '',
    address: ''
  };

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.loadSchools();
  }

  loadSchools() {
    this.http.get(`${environment.apiUrl}/api/schools/get_schools.php`)
      .subscribe({
        next: (data: any) => {
          this.schools = data.success ? data.schools : [];
          this.loading = false;
        },
        error: (error) => {
          console.error('Error loading schools:', error);
          this.loading = false;
        }
      });
  }

  addSchool() {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const schoolData = {
      ...this.newSchool,
      created_by: user.id
    };

    this.http.post(`${environment.apiUrl}/api/schools/add_school.php`, schoolData)
      .subscribe({
        next: (response: any) => {
          if (response.success) {
            alert('School registered successfully!');
            this.loadSchools();
            this.resetForm();
          }
        },
        error: (error) => {
          console.error('Error adding school:', error);
          alert('Error registering school');
        }
      });
  }

  editSchool(schoolId: number) {
    const school = this.schools.find(s => s.school_id === schoolId);
    if (school) {
      this.editSchoolData = {
        school_id: school.school_id,
        name: school.name,
        address: school.address
      };
      this.showEditForm = true;
    }
  }

  updateSchool() {
    this.http.put(`${environment.apiUrl}/api/schools/update_school.php`, this.editSchoolData)
      .subscribe({
        next: (response: any) => {
          if (response.success) {
            alert('School updated successfully!');
            this.loadSchools();
            this.closeEditModal();
          }
        },
        error: (error) => {
          console.error('Error updating school:', error);
          alert('Error updating school');
        }
      });
  }

  deleteSchool(schoolId: number) {
    if (confirm('Are you sure you want to delete this school?')) {
      this.http.delete(`${environment.apiUrl}/api/schools/delete_school.php?id=${schoolId}`)
        .subscribe({
          next: (response: any) => {
            if (response.success) {
              alert('School deleted successfully!');
              this.loadSchools();
            }
          },
          error: (error) => {
            console.error('Error deleting school:', error);
            alert('Error deleting school');
          }
        });
    }
  }

  resetForm() {
    this.newSchool = {
      name: '',
      address: ''
    };
    this.showAddForm = false;
  }

  closeModal() {
    this.showAddForm = false;
  }

  closeEditModal() {
    this.showEditForm = false;
    this.editSchoolData = {
      school_id: 0,
      name: '',
      address: ''
    };
  }
}