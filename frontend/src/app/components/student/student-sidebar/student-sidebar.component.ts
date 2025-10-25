import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-student-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './student-sidebar.component.html',
  styleUrls: ['./student-sidebar.component.scss']
})
export class StudentSidebarComponent {
  @Output() collapsedChange = new EventEmitter<boolean>();
  
  isCollapsed = false;
  isMobile = false;
  isMobileExpanded = false;
  isMobileBackdropVisible = false;

  constructor(private authService: AuthService, private router: Router) {}

  toggleSidebar() {
    if (this.isMobile) {
      this.isMobileExpanded = !this.isMobileExpanded;
      this.isMobileBackdropVisible = this.isMobileExpanded;
    } else {
      this.isCollapsed = !this.isCollapsed;
      this.collapsedChange.emit(this.isCollapsed);
    }
  }

  onMenuItemClick() {
    if (this.isMobile) {
      this.closeMobileSidebar();
    }
  }

  closeMobileSidebar() {
    this.isMobileExpanded = false;
    this.isMobileBackdropVisible = false;
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}