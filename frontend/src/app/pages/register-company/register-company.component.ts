import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ToastService } from '../../services/toast.service';

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
  companyData = {
    name: '',
    email: '',
    contact: '',
    password: ''
  };
  loading = false;

  private baseUrl = 'http://localhost:8081';

  constructor(
    private http: HttpClient,
    private router: Router,
    private toast: ToastService
  ) { }

  registerCompany() {
    if (!this.companyData.name || !this.companyData.email || !this.companyData.password) {
      this.toast.show('All fields are required!', 'error');
      return;
    }

    this.loading = true;
    this.http.post(`${this.baseUrl}/auth/register-company.php`, this.companyData, { responseType: 'json' })
      .subscribe({
        next: (res: any) => {
          this.toast.show(res.message || 'Company registration submitted for approval.', 'success');
          this.loading = false;
          this.http.post(`${this.baseUrl}/auth/notify_admin.php`, { role: 'COMPANY' })
            .subscribe({
              next: () => console.log('Admins notified successfully'),
              error: (err) => console.error('Failed to notify Companies', err)
            });
          this.router.navigate(['/login']);
        },
        error: (err) => {
          const errorMsg = err.error?.message || 'Registration failed. Please try again.';
          this.toast.show(errorMsg, 'error');
          this.loading = false;
        }
      });
  }
}
