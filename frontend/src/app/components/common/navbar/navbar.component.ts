import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ThemeToggleComponent } from '../../../shared/design-system';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, ThemeToggleComponent],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent {
  mobileMenuOpen = false;

  toggleMobileMenu() {
    this.mobileMenuOpen = !this.mobileMenuOpen;
  }
}
