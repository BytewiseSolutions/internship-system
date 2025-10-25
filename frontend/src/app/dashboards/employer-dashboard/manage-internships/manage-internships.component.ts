import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { EmployerSidebarComponent } from '../../../components/employer/employer-sidebar/employer-sidebar.component';
import { EmployerHeaderComponent } from '../../../components/employer/employer-header/employer-header.component';

@Component({
  selector: 'app-manage-internships',
  standalone: true,
  imports: [CommonModule, FormsModule, EmployerSidebarComponent, EmployerHeaderComponent],
  templateUrl: './manage-internships.component.html',
  styleUrls: ['./manage-internships.component.scss']
})
export class ManageInternshipsComponent implements OnInit {
  isSidebarCollapsed = false;
  internships: any[] = [];
  showModal = false;
  isEditing = false;
  currentInternship: any = {
    title: '',
    description: '',
    location: '',
    deadline: '',
    status: 'OPEN'
  };

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadInternships();
  }

  onSidebarCollapseChanged(collapsed: boolean): void {
    this.isSidebarCollapsed = collapsed;
  }

  loadInternships(): void {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    this.http.get(`http://localhost:8000/internships/get_internships.php?company_id=${user.companyId}`)
      .subscribe({
        next: (response: any) => {
          this.internships = response.internships || [];
        },
        error: (error) => {
          console.error('Error loading internships:', error);
        }
      });
  }

  openAddModal(): void {
    this.isEditing = false;
    this.currentInternship = {
      title: '',
      description: '',
      location: '',
      deadline: '',
      status: 'OPEN'
    };
    this.showModal = true;
  }

  editInternship(internship: any): void {
    this.isEditing = true;
    this.currentInternship = { ...internship };
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
  }

  saveInternship(): void {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const url = this.isEditing 
      ? 'http://localhost:8000/internships/update_internship.php'
      : 'http://localhost:8000/internships/create_internship.php';

    const data = {
      ...this.currentInternship,
      company_id: user.companyId
    };

    this.http.post(url, data).subscribe({
      next: (response: any) => {
        if (response.success) {
          this.loadInternships();
          this.closeModal();
        }
      },
      error: (error) => {
        console.error('Error saving internship:', error);
      }
    });
  }

  deleteInternship(id: number): void {
    if (confirm('Are you sure you want to delete this internship?')) {
      this.http.delete(`http://localhost:8000/internships/delete_internship.php?id=${id}`)
        .subscribe({
          next: (response: any) => {
            if (response.success) {
              this.loadInternships();
            }
          },
          error: (error) => {
            console.error('Error deleting internship:', error);
          }
        });
    }
  }
}