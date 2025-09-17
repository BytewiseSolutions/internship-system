import { CommonModule } from '@angular/common';
import { Component, EventEmitter, HostListener, Output } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-admin-sidebar',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './admin-sidebar.component.html',
  styleUrl: './admin-sidebar.component.scss'
})
export class AdminSidebarComponent {
  isCollapsed = false;
  isMobile = false;
  isMobileExpanded = false;
  @Output() collapsedChange = new EventEmitter<boolean>();

  constructor(private authService: AuthService, private router: Router) {
    this.handleResize();
  }

  @HostListener('window:resize')
  handleResize() {
    this.isMobile = window.innerWidth < 768;

    if (this.isMobile) {
      this.isMobileExpanded = false;
    } else {
      this.isCollapsed = false;
    }
  }

  toggleSidebar() {
    if (this.isMobile) {
      this.isMobileExpanded = !this.isMobileExpanded;
    } else {
      this.isCollapsed = !this.isCollapsed;
      this.collapsedChange.emit(this.isCollapsed);
    }
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
