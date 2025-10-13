import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Internship, InternshipService } from '../../../services/internship.service';
import { ToastService } from '../../../services/toast.service';

@Component({
  selector: 'app-manage-internships',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './manage-internships.component.html',
  styleUrls: ['./manage-internships.component.scss']
})
export class ManageInternshipsComponent implements OnInit {
  internships: Internship[] = [];
  searchTerm: string = '';
  showAddModal = false;
  showEditModal = false;
  loading = false;
  selectedInternship: Internship | null = null;
  companies: { id: number; name: string }[] = [];

  newInternship: Internship = {
    title: '',
    company_id: null,
    location: '',
    postedDate: new Date().toISOString().split('T')[0],
    deadline: new Date().toISOString().split('T')[0],
    description: '',
    status: 'ACTIVE'
  };


  constructor(
    private internshipService: InternshipService,
    private router: Router,
    private toast: ToastService
  ) { }

  ngOnInit(): void {
    this.loadInternships();
    this.loadCompanies();
  }
  loadCompanies(): void {
    this.internshipService.getCompanies().subscribe({
      next: (data) => {
        this.companies = data;
        // Auto-select company for company users
        if (data.length === 1) {
          this.newInternship.company_id = data[0].id;
        }
      },
      error: (err) => this.toast.show('Failed to load companies', 'error')
    });
  }
  loadInternships(): void {
    this.loading = true;
    this.internshipService.getInternships().subscribe({
      next: (data) => { this.internships = data; this.loading = false; },
      error: (err) => { this.loading = false; this.toast.show('Failed to load internships', 'error'); console.error(err); }
    });
  }

  openAddModal() {
    this.showAddModal = true;
    this.newInternship = { 
      title: '', 
      company_id: this.companies.length === 1 ? this.companies[0].id : null, 
      location: '', 
      postedDate: new Date().toISOString().split('T')[0], 
      deadline: new Date().toISOString().split('T')[0], 
      description: '', 
      status: 'ACTIVE' 
    };
  }
  closeAddModal() { this.showAddModal = false; }

  openEditModal(internship: Internship) {
    this.selectedInternship = { ...internship };
    this.showEditModal = true;
  }
  closeEditModal() {
    this.showEditModal = false;
    this.selectedInternship = null;
  }
  addInternship() {
    this.internshipService.addInternship(this.newInternship).subscribe({
      next: (added) => {
        this.internships.push(added);
        this.closeAddModal();
        this.toast.show('Internship added successfully', 'success');
      },
      error: (err) => { this.toast.show('Failed to add internship', 'error'); console.error(err); }
    });
  }

  updateInternship() {
    if (!this.selectedInternship?.id) return;
    this.internshipService.updateInternship(this.selectedInternship.id, this.selectedInternship).subscribe({
      next: (updated) => {
        const index = this.internships.findIndex(i => i.id === updated.id);
        if (index !== -1) this.internships[index] = updated;
        this.toast.show('Internship updated successfully', 'success');
        this.closeEditModal();
      },
      error: (err) => { this.toast.show('Failed to update internship', 'error'); console.error(err); }
    });
  }

  deleteInternship(id: number) {
    if (!confirm('Are you sure you want to delete this internship?')) return;
    this.internshipService.deleteInternship(id).subscribe({
      next: () => {
        this.internships = this.internships.filter(i => i.id !== id);
        this.toast.show('Internship deleted successfully', 'success');
      },
      error: (err) => { this.toast.show('Failed to delete internship', 'error'); console.error(err); }
    });
  }

  filteredInternships(): Internship[] {
    const term = this.searchTerm.toLowerCase();
    return this.internships.filter(i =>
      i.title.toLowerCase().includes(term) ||
      (i.company_name?.toLowerCase().includes(term)) ||
      i.location.toLowerCase().includes(term)
    );
  }
}
