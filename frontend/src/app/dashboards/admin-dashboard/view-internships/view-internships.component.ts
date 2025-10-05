// import { Component, OnInit } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { HttpClient } from '@angular/common/http';
// import { FormsModule } from '@angular/forms';

// interface Internship {
//   id: number;
//   title: string;
//   company_id: number | null;
//   company_name: string | null;
//   location: string;
//   postedDate: string;
//   deadline: string;
//   description: string;
//   status: string;
// }

// @Component({
//   selector: 'app-view-internships',
//   standalone: true,
//   imports: [CommonModule, FormsModule],
//   templateUrl: './view-internships.component.html',
//   styleUrls: ['./view-internships.component.scss']
// })
// export class ViewInternshipsComponent implements OnInit {
//   internships: Internship[] = [];
//   filteredInternships: Internship[] = [];
//   loading = true;
//   error: string | null = null;
//   apiUrl = 'http://localhost:8081/backend/internships';

//   filterTitle: string = '';
//   filterStatus: string = '';

//   constructor(private http: HttpClient) { }

//   ngOnInit(): void {
//     this.loadInternships();
//   }

//   loadInternships(): void {
//     this.http.get<Internship[]>(`${this.apiUrl}/get_internships.php`)
//       .subscribe({
//         next: (res) => {
//           this.internships = res;
//           this.filteredInternships = [...this.internships];
//           this.loading = false;
//         },
//         error: (err) => {
//           console.error('Error fetching internships', err);
//           this.error = 'Could not load internships';
//           this.loading = false;
//         }
//       });
//   }

//   filterInternshipsList(): void {
//     this.filteredInternships = this.internships.filter(internship => {
//       const matchesTitle = this.filterTitle
//         ? internship.title.toLowerCase().includes(this.filterTitle.toLowerCase())
//         : true;

//       const matchesStatus = this.filterStatus
//         ? internship.status.toLowerCase() === this.filterStatus.toLowerCase()
//         : true;

//       return matchesTitle && matchesStatus;
//     });
//   }
// }

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
  apiUrl = 'http://localhost:8081/backend/internships';

  filterTitle: string = '';
  filterStatus: string = '';

  // Statistics
  stats = {
    total: 0,
    active: 0,
    inactive: 0,
    expiring: 0
  };

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
          this.calculateStats();
          this.loading = false;
        },
        error: (err) => {
          console.error('Error fetching internships', err);
          this.error = 'Could not load internships. Please try again later.';
          this.loading = false;
        }
      });
  }

  calculateStats(): void {
    this.stats.total = this.internships.length;
    this.stats.active = this.internships.filter(internship => internship.status === 'Active').length;
    this.stats.inactive = this.internships.filter(internship => internship.status === 'Inactive').length;

    // Calculate expiring soon (within 7 days)
    const today = new Date();
    const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
    this.stats.expiring = this.internships.filter(internship => {
      const deadline = new Date(internship.deadline);
      return deadline > today && deadline <= nextWeek && internship.status === 'Active';
    }).length;
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

  // Helper method to get status class
  getStatusClass(status: string): string {
    return status.toLowerCase();
  }

  // Helper method to check if deadline is approaching
  isDeadlineApproaching(deadline: string): boolean {
    const deadlineDate = new Date(deadline);
    const today = new Date();
    const timeDiff = deadlineDate.getTime() - today.getTime();
    const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
    return daysDiff <= 7 && daysDiff > 0;
  }

  isDeadlinePassed(deadline: string): boolean {
    return new Date(deadline) < new Date();
  }

  getDeadlineClass(deadline: string): string {
    if (this.isDeadlinePassed(deadline)) {
      return 'deadline-passed';
    } else if (this.isDeadlineApproaching(deadline)) {
      return 'deadline-approaching';
    }
    return '';
  }

  getRowClass(internship: Internship): string {
    if (this.isDeadlinePassed(internship.deadline) && internship.status === 'Active') {
      return 'deadline-critical';
    } else if (this.isDeadlineApproaching(internship.deadline)) {
      return 'deadline-warning';
    }
    return '';
  }
}
