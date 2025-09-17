import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-student-header',
  imports: [],
  templateUrl: './student-header.component.html',
  styleUrl: './student-header.component.scss'
})
export class StudentHeaderComponent {
  @Input() isSidebarCollapsed = false;
  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
