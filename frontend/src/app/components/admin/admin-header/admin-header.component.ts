import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-admin-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-header.component.html',
  styleUrl: './admin-header.component.scss'
})
export class AdminHeaderComponent {
  @Input() isSidebarCollapsed = false;
  constructor(private authService: AuthService, private router: Router) { }


  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
