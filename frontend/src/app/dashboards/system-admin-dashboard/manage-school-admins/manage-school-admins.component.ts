import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-manage-school-admins',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './manage-school-admins.component.html',
  styleUrls: ['./manage-school-admins.component.scss']
})
export class ManageSchoolAdminsComponent implements OnInit {
  schoolAdmins: any[] = [];
  schools: any[] = [];
  loading = true;
  showAddForm = false;
  newAdmin = {
    name: '',
    email: '',
    school_id: '',
    password: ''
  };

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.loadSchoolAdmins();
    this.loadSchools();
  }

  loadSchoolAdmins() {
    this.http.get(`${environment.apiUrl}/api/users/get_school_admins.php`)
      .subscribe({
        next: (data: any) => {
          this.schoolAdmins = Array.isArray(data) ? data : (data.success ? data.schoolAdmins || data.users || [] : []);
          this.loading = false;
        },
        error: (error) => {
          console.error('Error loading school admins:', error);
          this.loading = false;
        }
      });
  }

  loadSchools() {
    this.http.get(`${environment.apiUrl}/api/schools/get_schools.php`)
      .subscribe({
        next: (data: any) => {
          this.schools = data.success ? data.schools : [];
        },
        error: (error) => {
          console.error('Error loading schools:', error);
        }
      });
  }

  addSchoolAdmin() {
    const adminData = {
      ...this.newAdmin,
      role: 'SCHOOL_ADMIN'
    };

    this.http.post(`${environment.apiUrl}/api/users/add_school_admin.php`, adminData)
      .subscribe({
        next: (response: any) => {
          if (response.success) {
            alert('School admin created successfully!');
            this.loadSchoolAdmins();
            this.resetForm();
          }
        },
        error: (error) => {
          console.error('Error adding school admin:', error);
          alert('Error creating school admin');
        }
      });
  }

  deleteAdmin(adminId: number) {
    if (confirm('Are you sure you want to delete this school admin?')) {
      this.http.delete(`${environment.apiUrl}/api/users/delete_user.php?id=${adminId}`)
        .subscribe({
          next: (response: any) => {
            if (response.success) {
              alert('School admin deleted successfully!');
              this.loadSchoolAdmins();
            }
          },
          error: (error) => {
            console.error('Error deleting school admin:', error);
            alert('Error deleting school admin');
          }
        });
    }
  }

  resetForm() {
    this.newAdmin = {
      name: '',
      email: '',
      school_id: '',
      password: ''
    };
    this.showAddForm = false;
  }

  closeModal() {
    this.showAddForm = false;
  }

  getSchoolName(admin: any): string {
    return admin.school_name || 'Unknown School';
  }
}