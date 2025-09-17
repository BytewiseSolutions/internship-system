import { Component, OnInit } from '@angular/core';
import { Company, CompanyService } from '../../../services/company.service';
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
    this.modalCompany = { name: '', email: '', industry: '', createdAt: new Date(), status: 'ACTIVE' };
    this.modalMode = 'add';
    this.showModal = true;
  }

  openEditModal(company: Company) {
    this.modalCompany = { ...company };
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

  handleModalSave(company: Company) {
    if (this.modalMode === 'add') this.addCompany(company);
    else if (this.modalMode === 'edit') this.updateCompany(company);
  }

  addCompany(company: Company) {
    this.companyService.addCompany(company).subscribe({
      next: added => {
        this.companies.push(added);
        this.handleModalClose();
        this.toast.show('Company added successfully', 'success');
      },
      error: err => {
        this.toast.show('Failed to add company', 'error');
        console.error('Add error:', err);
      }
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
