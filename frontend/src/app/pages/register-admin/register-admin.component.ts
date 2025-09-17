import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-register-admin',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink
  ],
  templateUrl: './register-admin.component.html',
  styleUrls: ['./register-admin.component.scss']
})
export class RegisterAdminComponent {
  adminData = {
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

  registerAdmin() {
    if (!this.adminData.name || !this.adminData.email || !this.adminData.password) {
      this.toast.show('All fields are required!', 'error');
      return;
    }

    this.loading = true;
    this.http.post(`${this.baseUrl}/auth/register-admin.php`, this.adminData, { responseType: 'json' })
      .subscribe({
        next: (res: any) => {
          this.toast.show(res.message || 'Admin registration submitted for approval.', 'success');
          this.loading = false;

          this.http.post(`${this.baseUrl}/auth/notify-admin.php`, { role: 'ADMIN' })
            .subscribe({
              next: () => console.log('Admins notified successfully'),
              error: (err) => console.error('Failed to notify admins', err)
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
