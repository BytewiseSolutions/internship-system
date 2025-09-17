import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ToastService } from '../../services/toast.service';



@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent {
  token = '';
  newPassword = '';
  confirmPassword = '';
  loading = false;

  constructor(
    private route: ActivatedRoute,
    private authService: AuthService,
    private toast: ToastService,
    private router: Router
  ) {
    this.token = this.route.snapshot.queryParamMap.get('token') || '';
  }

  resetPassword() {
    if (!this.newPassword || this.newPassword !== this.confirmPassword) {
      this.toast.show('Passwords do not match.', 'error');
      return;
    }

    this.loading = true;
    this.authService.resetPassword(this.token, this.newPassword).subscribe({
      next: (res: any) => {
        this.toast.show(res.message || 'Password reset successful!', 'success');
        setTimeout(() => this.router.navigate(['/login']), 3000);
      },
      error: (err) => {
        const errorMsg = err.error?.message || 'Failed to reset password.';
        this.toast.show(errorMsg, 'error');
        this.loading = false;
      }
    });
  }
}
