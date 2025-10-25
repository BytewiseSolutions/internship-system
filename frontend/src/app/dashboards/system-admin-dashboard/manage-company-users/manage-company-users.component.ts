import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-manage-company-users',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './manage-company-users.component.html',
  styleUrls: ['./manage-company-users.component.scss']
})
export class ManageCompanyUsersComponent implements OnInit {
  companyUsers: any[] = [];
  companies: any[] = [];
  loading = true;
  showAddForm = false;
  newUser = {
    name: '',
    email: '',
    company_id: '',
    password: ''
  };

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.loadCompanyUsers();
    this.loadCompanies();
  }

  loadCompanyUsers() {
    this.http.get(`${environment.apiUrl}/api/users/get_company_users.php`)
      .subscribe({
        next: (data: any) => {
          this.companyUsers = Array.isArray(data) ? data : (data.success ? data.users || [] : []);
          this.loading = false;
        },
        error: (error) => {
          console.error('Error loading company users:', error);
          this.loading = false;
        }
      });
  }

  loadCompanies() {
    this.http.get(`${environment.apiUrl}/company/get_companies.php`)
      .subscribe({
        next: (data: any) => {
          this.companies = data;
        },
        error: (error) => {
          console.error('Error loading companies:', error);
        }
      });
  }

  addCompanyUser() {
    const userData = {
      ...this.newUser,
      role: 'EMPLOYER'
    };

    this.http.post(`${environment.apiUrl}/api/users/add_company_user.php`, userData)
      .subscribe({
        next: (response: any) => {
          if (response.success) {
            alert('Company user created successfully!');
            this.loadCompanyUsers();
            this.resetForm();
          }
        },
        error: (error) => {
          console.error('Error adding company user:', error);
          alert('Error creating company user');
        }
      });
  }

  deleteUser(userId: number) {
    if (confirm('Are you sure you want to delete this company user?')) {
      this.http.delete(`${environment.apiUrl}/api/users/delete_user.php?id=${userId}`)
        .subscribe({
          next: (response: any) => {
            if (response.success) {
              alert('Company user deleted successfully!');
              this.loadCompanyUsers();
            }
          },
          error: (error) => {
            console.error('Error deleting company user:', error);
            alert('Error deleting company user');
          }
        });
    }
  }

  resetForm() {
    this.newUser = {
      name: '',
      email: '',
      company_id: '',
      password: ''
    };
    this.showAddForm = false;
  }

  closeModal() {
    this.showAddForm = false;
  }

  getCompanyName(user: any): string {
    return user.company_name || 'Unknown Company';
  }
}