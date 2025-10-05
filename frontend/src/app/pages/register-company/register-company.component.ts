import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ToastService } from '../../services/toast.service';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-register-company',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink
  ],
  templateUrl: './register-company.component.html',
  styleUrls: ['./register-company.component.scss']
})
export class RegisterCompanyComponent {
  step = 1;
  loading = false;

  userData = {
    name: '',
    email: '',
    contact: '',
    password: ''
  };

  companyData = {
    name: '',
    email: '',
    industry: '',
    status: 'ACTIVE'
  };

  private baseUrl = `${environment.apiUrl}/backend`;

  constructor(
    private http: HttpClient,
    private router: Router,
    private toast: ToastService
  ) { }

  registerUser() {
    if (!this.userData.name || !this.userData.email || !this.userData.password) {
      this.toast.show('All fields are required!', 'error');
      return;
    }

    this.loading = true;
    this.http.post(`${this.baseUrl}/auth/register-company-user.php`, this.userData, { responseType: 'json' })
      .subscribe({
        next: (res: any) => {
          this.toast.show(res.message || 'Account created. Now enter company details.', 'success');
          this.loading = false;

          localStorage.setItem('newCompanyUserId', res.user_id);

          this.step = 2;
        },
        error: (err) => {
          const errorMsg = err.error?.message || 'User registration failed. Please try again.';
          this.toast.show(errorMsg, 'error');
          this.loading = false;
        }
      });
  }
  registerCompany() {
    const userId = localStorage.getItem('newCompanyUserId');
    if (!userId) {
      this.toast.show('User not found. Please restart registration.', 'error');
      return;
    }

    this.loading = true;
    const payload = { ...this.companyData, user_id: userId };

    this.http.post(`${this.baseUrl}/auth/register-company-details.php`, payload, { responseType: 'json' })
      .subscribe({
        next: (res: any) => {
          this.toast.show(res.message || 'Company registered successfully.', 'success');
          this.loading = false;
          localStorage.removeItem('newCompanyUserId');

          this.http.post(`${this.baseUrl}/auth/notify-admin.php`, { role: 'COMPANY' }).subscribe();

          this.router.navigate(['/login']);
        },
        error: (err) => {
          const errorMsg = err.error?.message || 'Company registration failed.';
          this.toast.show(errorMsg, 'error');
          this.loading = false;
        }
      });
  }
}
