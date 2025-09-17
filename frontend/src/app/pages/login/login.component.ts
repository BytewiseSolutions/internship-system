import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ToastService } from '../../services/toast.service';


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  credentials = { email: '', password: '', rememberMe: false };
  loading = false;
  showModal = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private toast: ToastService
  ) { }

  openModal() {
    this.showModal = true;
  }
  closeModal() {
    this.showModal = false;
  }

  selectRole(role: string) {
    this.closeModal();
    if (role === 'STUDENT') {
      this.router.navigate(['/register']);
    } else if (role === 'COMPANY') {
      this.router.navigate(['/register-company']);
    } else if (role === 'ADMIN') {
      this.router.navigate(['/register-admin']);
    }
  }

  login() {
    this.loading = true;
    this.authService.login(this.credentials).subscribe({
      next: (response: any) => {
        this.toast.show('Login successful! Redirecting...', 'success');

        const userObj = {
          id: response.id,
          name: response.name ?? '',
          email: response.email,
          role: response.role,
          token: response.token ?? null,
          companyId: response.company_id ?? null
        };

        localStorage.setItem('user', JSON.stringify(userObj));

        if (this.credentials.rememberMe) {
          localStorage.setItem('email', this.credentials.email);
        } else {
          localStorage.removeItem('email');
        }

        setTimeout(() => {
          if (response.role === 'ADMIN') {
            this.router.navigate(['/admin-dashboard']);
          } else if (response.role === 'COMPANY') {
            this.router.navigate(['/company-dashboard']);
          } else if (response.role === 'STUDENT') {
            this.router.navigate(['/student-dashboard']);
          }
        }, 3000);
      },

      error: err => {
        const errorMsg = err.error?.message || 'Invalid email or password.';
        this.toast.show(errorMsg, 'error');
        this.loading = false;
      }
    });
  }
}
