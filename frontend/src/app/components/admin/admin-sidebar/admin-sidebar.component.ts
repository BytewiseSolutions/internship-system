import { CommonModule } from '@angular/common';
import { Component, EventEmitter, HostListener, Output } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-admin-sidebar',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './admin-sidebar.component.html',
  styleUrls: ['./admin-sidebar.component.scss']
})
export class AdminSidebarComponent {
  isCollapsed = false;
  isMobile = false;
  isMobileExpanded = false;
  isMobileBackdropVisible = false;

  @Output() collapsedChange = new EventEmitter<boolean>();

  constructor(private authService: AuthService, private router: Router) {
    this.handleResize();
  }

  @HostListener('window:resize')
  handleResize() {
    this.isMobile = window.innerWidth < 768;

    if (this.isMobile) {
      this.isMobileExpanded = false;
      this.isMobileBackdropVisible = false;
    } else {
      this.isCollapsed = false;
      this.isMobileBackdropVisible = false;
    }

    this.collapsedChange.emit(this.isCollapsed);
  }

  toggleSidebar() {
    if (this.isMobile) {
      this.isMobileExpanded = !this.isMobileExpanded;
      this.isMobileBackdropVisible = this.isMobileExpanded;
    } else {
      this.isCollapsed = !this.isCollapsed;
      this.collapsedChange.emit(this.isCollapsed);
    }
  }

  closeMobileSidebar() {
    if (this.isMobile) {
      this.isMobileExpanded = false;
      this.isMobileBackdropVisible = false;
    }
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  // Close sidebar when clicking on a menu item on mobile
  onMenuItemClick() {
    if (this.isMobile) {
      this.closeMobileSidebar();
    }
  }
}
