import { Component, OnInit } from '@angular/core';
import { AddCompanyPayload, Company, CompanyService } from '../../../services/company.service';
import { ToastService } from '../../../services/toast.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CompanyModalComponent } from './company-modal/company-modal.component';

@Component({
  selector: 'app-manage-companies',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    CompanyModalComponent
  ],
  templateUrl: './manage-companies.component.html',
  styleUrls: ['./manage-companies.component.scss']
})
export class ManageCompaniesComponent implements OnInit {
  companies: Company[] = [];
  searchTerm: string = '';
  loading = false;

  showModal = false;
  modalMode: 'add' | 'edit' | 'view' = 'view';
  modalCompany: Company | null = null;

  constructor(
    private companyService: CompanyService,
    private toast: ToastService
  ) { }

  ngOnInit(): void {
    this.loadCompanies();
  }

  loadCompanies(): void {
    this.loading = true;
    this.companyService.getCompanies().subscribe({
      next: data => {
        this.companies = data;
        this.loading = false;
      },
      error: err => {
        this.loading = false;
        this.toast.show('Failed to fetch companies', 'error');
        console.error('Fetch error:', err);
      }
    });
  }

  openAddModal() {
    this.modalCompany = {
      name: '',
      email: '',
      industry: '',
      createdAt: new Date(),
      status: 'ACTIVE',
      user: { name: '', email: '', contact: '', password: '' }
    };
    this.modalMode = 'add';
    this.showModal = true;
  }

  openEditModal(company: Company) {
    this.modalCompany = {
      ...company,
      user: company.user ?? { name: '', email: '', contact: '', password: '' }
    };
    this.modalMode = 'edit';
    this.showModal = true;
  }

  viewCompany(company: Company) {
    this.modalCompany = { ...company };
    this.modalMode = 'view';
    this.showModal = true;
  }

  handleModalClose() {
    this.showModal = false;
    this.modalCompany = null;
  }

  handleModalSave(added: Company) {
    if (this.modalMode === 'add') {
      this.toast.show('Company added successfully', 'success');
    } else if (this.modalMode === 'edit') {
      this.toast.show('Company updated successfully', 'success');
    }

    this.loadCompanies();
    this.handleModalClose();
  }

  addCompany(company: Company) {
    if (!company.user) {
      this.toast.show('User info is required', 'error');
      return;
    }

    this.companyService.addUser(company.user).subscribe({
      next: (user: any) => {
        const payload: AddCompanyPayload = {
          user: company.user!,
          company: {
            name: company.name,
            email: company.email,
            industry: company.industry,
            status: company.status,
            createdAt: company.createdAt
          }
        };

        this.companyService.addCompany(payload).subscribe({
          next: added => {
            this.companies.push(added);
            this.handleModalClose();
            this.toast.show('Company added successfully', 'success');
            this.loadCompanies();
            this.handleModalClose();
          },
          error: err => this.toast.show('Failed to add company', 'error')
        });
      },
      error: err => this.toast.show('Failed to add user', 'error')
    });
  }

  updateCompany(company: Company) {
    if (!company.id) return;
    this.companyService.updateCompany(company.id, company).subscribe({
      next: updated => {
        const index = this.companies.findIndex(c => c.id === updated.id);
        if (index !== -1) this.companies[index] = updated;
        this.toast.show('Company updated successfully', 'success');
        this.handleModalClose();
      },
      error: err => {
        this.toast.show('Failed to update company', 'error');
        console.error('Update error:', err);
      }
    });
  }

  deleteCompany(company: Company) {
    if (!company.id) return;
    if (confirm(`Are you sure you want to delete ${company.name}?`)) {
      this.companyService.deleteCompany(company.id).subscribe({
        next: () => {
          this.companies = this.companies.filter(c => c.id !== company.id);
          this.toast.show('Company deleted successfully', 'success');
        },
        error: err => {
          this.toast.show('Failed to delete company', 'error');
          console.error('Delete error:', err);
        }
      });
    }
  }

  toggleCompanyStatus(company: Company) {
    if (!company.id) return;
    const newStatus = company.status === 'Blocked' ? 'Active' : 'Blocked';
    if (confirm(`Are you sure you want to ${newStatus.toLowerCase()} this company?`)) {
      this.companyService.updateStatus(company.id, newStatus).subscribe({
        next: () => {
          company.status = newStatus;
          this.toast.show(`Company ${newStatus.toLowerCase()} successfully`, 'success');
        },
        error: err => {
          this.toast.show('Failed to change status', 'error');
          console.error('Status update error:', err);
        }
      });
    }
  }

  filteredCompanies() {
    const search = this.searchTerm.toLowerCase();
    return this.companies.filter(c =>
      c.name.toLowerCase().includes(search) || c.email.toLowerCase().includes(search)
    );
  }
}
