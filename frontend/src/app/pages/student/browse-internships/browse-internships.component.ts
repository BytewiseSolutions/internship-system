import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { StudentHeaderComponent } from '../../../components/student/student-header/student-header.component';
import { StudentSidebarComponent } from '../../../components/student/student-sidebar/student-sidebar.component';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-browse-internships',
  standalone: true,
  imports: [CommonModule, FormsModule, StudentHeaderComponent, StudentSidebarComponent, RouterModule],
  templateUrl: './browse-internships.component.html',
  styleUrls: ['./browse-internships.component.scss']
})
export class BrowseInternshipsComponent implements OnInit {
  isSidebarCollapsed = false;
  internships: any[] = [];
  filteredInternships: any[] = [];
  loading = true;
  error = '';
  
  filters = {
    search: '',
    location: '',
    company: ''
  };

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.loadInternships();
  }

  loadInternships() {
    this.http.get(`${environment.apiUrl}/internships/get_available_internships.php`).subscribe({
      next: (response: any) => {
        this.internships = Array.isArray(response) ? response : [];
        this.filteredInternships = [...this.internships];
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading internships:', error);
        this.error = 'Failed to load internships';
        this.loading = false;
      }
    });
  }

  onSidebarCollapseChanged(collapsed: boolean) {
    this.isSidebarCollapsed = collapsed;
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString();
  }

  isDeadlineNear(deadline: string): boolean {
    const deadlineDate = new Date(deadline);
    const today = new Date();
    const diffTime = deadlineDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 7;
  }

  applyFilters() {
    this.filteredInternships = this.internships.filter(internship => {
      const matchesSearch = !this.filters.search || 
        internship.title.toLowerCase().includes(this.filters.search.toLowerCase()) ||
        internship.company_name.toLowerCase().includes(this.filters.search.toLowerCase()) ||
        internship.description.toLowerCase().includes(this.filters.search.toLowerCase());
      
      const matchesLocation = !this.filters.location || 
        internship.location.toLowerCase().includes(this.filters.location.toLowerCase());
      
      const matchesCompany = !this.filters.company || 
        internship.company_name.toLowerCase().includes(this.filters.company.toLowerCase());
      
      return matchesSearch && matchesLocation && matchesCompany;
    });
  }

  clearFilters() {
    this.filters = { search: '', location: '', company: '' };
    this.filteredInternships = [...this.internships];
  }
}