import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FooterComponent } from '../../components/common/footer/footer.component';
import { NavbarComponent } from '../../components/common/navbar/navbar.component';
import { AvailableInternship, InternshipService } from '../../services/internship.service';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [
    RouterLink,
    CommonModule,
    NavbarComponent,
    FooterComponent,
  ],
  templateUrl: './landing.component.html',
  styleUrl: './landing.component.scss'
})
export class LandingComponent implements OnInit {
  internships: AvailableInternship[] = [];
  mobileMenuOpen = false;

  constructor(
    private router: Router,
    private internshipService: InternshipService
  ) { }

  toggleMobileMenu() {
    this.mobileMenuOpen = !this.mobileMenuOpen;
  }
  ngOnInit() {
    this.internshipService.getAvailableInternships().subscribe({
      next: (data) => this.internships = data,
      error: (err) => console.error('Error fetching internships', err)
    });
  }
  applyNow(internshipId: number) {
    const loggedIn = localStorage.getItem('user');
    if (loggedIn) {
      this.router.navigate(['/apply', internshipId]);
    } else {
      this.router.navigate(['/login'], { queryParams: { redirect: `/apply/${internshipId}` } });
    }
  }
}
