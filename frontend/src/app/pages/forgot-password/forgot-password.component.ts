import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ToastService } from '../../services/toast.service';


@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterLink],
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent {
  email = '';
  loading = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private toast: ToastService
  ) { }

  sendResetLink() {
    if (!this.email) {
      this.toast.show('Please enter a valid email.', 'error');
      console.error('Forgot password attempt without an email');
      return;
    }

    this.loading = true;
    this.authService.forgotPassword(this.email).subscribe({
      next: (response) => {
        console.log('Forgot password response:', response);
        this.toast.show(response.message || 'Reset link sent to your email!', 'success');
        this.loading = false;
      },
      error: err => {
        console.error('Forgot password error:', err);
        const errorMsg = err.error?.message || 'Failed to send reset link.';
        this.toast.show(errorMsg, 'error');
        this.loading = false;
      }
    });
  }

}
