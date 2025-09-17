import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

interface Internship {
  id: number;
  title: string;
  company_id: number | null;
  company_name: string | null;
  location: string;
  postedDate: string;
  deadline: string;
  description: string;
  status: string;
}

@Component({
  selector: 'app-view-internships',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './view-internships.component.html',
  styleUrls: ['./view-internships.component.scss']
})
export class ViewInternshipsComponent implements OnInit {
  internships: Internship[] = [];
  filteredInternships: Internship[] = [];
  loading = true;
  error: string | null = null;
  apiUrl = 'http://localhost:8081/internships';

  filterTitle: string = '';
  filterStatus: string = '';

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.loadInternships();
  }

  loadInternships(): void {
    this.http.get<Internship[]>(`${this.apiUrl}/get_internships.php`)
      .subscribe({
        next: (res) => {
          this.internships = res;
          this.filteredInternships = [...this.internships];
          this.loading = false;
        },
        error: (err) => {
          console.error('Error fetching internships', err);
          this.error = 'Could not load internships';
          this.loading = false;
        }
      });
  }

  filterInternshipsList(): void {
    this.filteredInternships = this.internships.filter(internship => {
      const matchesTitle = this.filterTitle
        ? internship.title.toLowerCase().includes(this.filterTitle.toLowerCase())
        : true;

      const matchesStatus = this.filterStatus
        ? internship.status.toLowerCase() === this.filterStatus.toLowerCase()
        : true;

      return matchesTitle && matchesStatus;
    });
  }
}
