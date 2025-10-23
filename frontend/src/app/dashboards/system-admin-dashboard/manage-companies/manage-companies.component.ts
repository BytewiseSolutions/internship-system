import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-system-manage-companies',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './manage-companies.component.html',
  styleUrls: ['./manage-companies.component.scss']
})
export class SystemManageCompaniesComponent implements OnInit {
  companies: any[] = [];
  loading = true;
  showAddForm = false;
  newCompany = {
    name: '',
    email: '',
    address: ''
  };

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.loadCompanies();
  }

  loadCompanies() {
    this.http.get(`${environment.apiUrl}/company/get_companies.php`)
      .subscribe({
        next: (data: any) => {
          this.companies = data;
          this.loading = false;
        },
        error: (error) => {
          console.error('Error loading companies:', error);
          this.loading = false;
        }
      });
  }

  addCompany() {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const companyData = {
      ...this.newCompany,
      created_by: user.id
    };

    this.http.post(`${environment.apiUrl}/company/add_company.php`, companyData)
      .subscribe({
        next: (response: any) => {
          if (response.success) {
            alert('Company registered successfully!');
            this.loadCompanies();
            this.resetForm();
          }
        },
        error: (error) => {
          console.error('Error adding company:', error);
          alert('Error registering company');
        }
      });
  }

  resetForm() {
    this.newCompany = {
      name: '',
      email: '',
      address: ''
    };
    this.showAddForm = false;
  }

  closeModal() {
    this.showAddForm = false;
  }

  activateCompany(companyId: number) {
    this.updateCompanyStatus(companyId, 'ACTIVE');
  }

  deactivateCompany(companyId: number) {
    this.updateCompanyStatus(companyId, 'INACTIVE');
  }

  updateCompanyStatus(companyId: number, status: string) {
    this.http.put(`${environment.apiUrl}/company/update_company_status.php`, {
      company_id: companyId,
      status: status
    }).subscribe({
      next: (response: any) => {
        if (response.success) {
          alert(`Company ${status.toLowerCase()} successfully!`);
          this.loadCompanies();
        }
      },
      error: (error) => {
        console.error('Error updating company status:', error);
        alert('Error updating company status');
      }
    });
  }

  deleteCompany(companyId: number) {
    if (confirm('Are you sure you want to delete this company?')) {
      this.http.delete(`${environment.apiUrl}/company/delete_company.php?id=${companyId}`)
        .subscribe({
          next: (response: any) => {
            if (response.success) {
              alert('Company deleted successfully!');
              this.loadCompanies();
            }
          },
          error: (error) => {
            console.error('Error deleting company:', error);
            alert('Error deleting company');
          }
        });
    }
  }
}