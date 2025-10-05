import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
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

  selectedCompany: string = '';
  locationFilter: string = '';
  deadlineFilter: string = '';

  constructor(
    private router: Router,
    private internshipService: InternshipService
  ) { }

  ngOnInit() {
    this.internshipService.getAvailableInternships().subscribe({
      next: (data) => {
        this.internships = data;
        this.companies = [...new Set(data.map(i => i.name))];
      },
      error: (err) => console.error('Error fetching internships', err)
    });
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
  clearFilters() {
    this.selectedCompany = '';
    this.locationFilter = '';
    this.deadlineFilter = '';
  }

}
