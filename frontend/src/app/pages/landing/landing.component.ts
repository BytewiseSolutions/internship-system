import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FooterComponent } from '../../components/common/footer/footer.component';
import { NavbarComponent } from '../../components/common/navbar/navbar.component';
import { AvailableInternship, InternshipService } from '../../services/internship.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [
    RouterLink,
    CommonModule,
    NavbarComponent,
    FooterComponent,
    FormsModule
  ],
  templateUrl: './landing.component.html',
  styleUrl: './landing.component.scss'
})
export class LandingComponent implements OnInit {
  internships: AvailableInternship[] = [];
  companies: string[] = [];
  mobileMenuOpen = false;
  hasAcceptedInternship = false;

  selectedCompany: string = '';
  locationFilter: string = '';
  deadlineFilter: string = '';

  constructor(
    private router: Router,
    private internshipService: InternshipService,
    private http: HttpClient
  ) { }

  ngOnInit() {
    this.internshipService.getAvailableInternships().subscribe({
      next: (data) => {
        this.internships = data;
        this.companies = [...new Set(data.map(i => i.name))];
      },
      error: (err) => console.error('Error fetching internships', err)
    });
    this.checkAcceptedStatus();
  }

  checkAcceptedStatus() {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (user?.id && user.role === 'STUDENT') {
      this.http.get(`http://localhost:8000/students/get_student_id.php?user_id=${user.id}`).subscribe({
        next: (response: any) => {
          if (response.student_id) {
            this.http.get(`http://localhost:8000/applications/check_accepted_status.php?student_id=${response.student_id}`).subscribe({
              next: (result: any) => {
                this.hasAcceptedInternship = result.hasAcceptedInternship;
              }
            });
          }
        }
      });
    }
  }
  filteredInternships(): AvailableInternship[] {
    return this.internships.filter(i => {
      const matchCompany = !this.selectedCompany || i.name === this.selectedCompany;
      const matchLocation = !this.locationFilter ||
        i.location.toLowerCase().includes(this.locationFilter.toLowerCase());

      const today = new Date().toISOString().split('T')[0];
      const matchDeadline =
        !this.deadlineFilter ||
        (this.deadlineFilter === 'upcoming' && i.deadline >= today) ||
        (this.deadlineFilter === 'expired' && i.deadline < today);

      return matchCompany && matchLocation && matchDeadline;
    });
  }
  toggleMobileMenu() {
    this.mobileMenuOpen = !this.mobileMenuOpen;
  }
  applyNow(internshipId: number) {
    const loggedIn = localStorage.getItem('user');
    if (loggedIn) {
      this.router.navigate(['/apply', internshipId]);
    } else {
      this.router.navigate(['/login'], { queryParams: { redirect: `/apply/${internshipId}` } });
    }
  }

  isDeadlinePassed(deadline: string): boolean {
    const today = new Date().toISOString().split('T')[0];
    return deadline < today;
  }
  clearFilters() {
    this.selectedCompany = '';
    this.locationFilter = '';
    this.deadlineFilter = '';
  }

  hasActiveFilters(): boolean {
    return !!(this.selectedCompany || this.locationFilter || this.deadlineFilter);
  }

}
