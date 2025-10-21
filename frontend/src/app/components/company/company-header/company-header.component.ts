import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-company-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './company-header.component.html',
  styleUrl: './company-header.component.scss'
})
export class CompanyHeaderComponent {
  @Input() isSidebarCollapsed = false;
  userName: string = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit() {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    this.userName = user.name || 'Company User';
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
