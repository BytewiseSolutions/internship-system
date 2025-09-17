import { Component } from '@angular/core';
import { CompanyHeaderComponent } from '../../components/company/company-header/company-header.component';
import { CompanySidebarComponent } from '../../components/company/company-sidebar/company-sidebar.component';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-company-dashboard',
  standalone: true,
  imports: [CompanyHeaderComponent, CompanySidebarComponent],
  templateUrl: './company-dashboard.component.html',
  styleUrl: './company-dashboard.component.scss'
})
export class CompanyDashboardComponent {
  isSidebarCollapsed = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private http: HttpClient
  ) { }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  onSidebarCollapseChanged(collapsed: boolean) {
    this.isSidebarCollapsed = collapsed;
  }
}
