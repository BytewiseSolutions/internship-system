import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FooterComponent } from '../../components/common/footer/footer.component';
import { NavbarComponent } from '../../components/common/navbar/navbar.component';

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
export class LandingComponent {

   mobileMenuOpen = false;
  constructor(private router: Router) { }


   toggleMobileMenu() {
    this.mobileMenuOpen = !this.mobileMenuOpen;
  }
  
 internships = [
    {
      title: 'Frontend Developer Intern',
      company: 'Tech Solutions',
      location: 'Maseru',
      postedDate: '2025-07-20',
      description: 'Assist in building Angular-based user interfaces.'
    },
    {
      title: 'Marketing Assistant',
      company: 'Lesotho Brands',
      location: 'Mafeteng',
      postedDate: '2025-07-18',
      description: 'Support campaign management and social media strategies.'
    },
    {
      title: 'Data Analyst Intern',
      company: 'AgriTech Lesotho',
      location: 'Teyateyaneng',
      postedDate: '2025-07-19',
      description: 'Work with agri-data to provide insights and reports.'
    }
  ];

 applyNow() {
    const loggedIn = localStorage.getItem('user'); 
    if (loggedIn) {
      alert('You are logged in, redirect to application form.');
    } else {
      this.router.navigate(['/login'], { queryParams: { redirect: 'register' } });
    }
  }
}
