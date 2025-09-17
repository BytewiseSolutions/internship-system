import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ToastService } from '../../services/toast.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  student = {
    name: '',
    email: '',
    contact: '',
    password: '',
    role: 'STUDENT'
  };

  message = '';
  isSuccess = false;
  showMessage = false;
  loading = false;

  constructor(
    private authService: AuthService,
    private router: Router, private toast: ToastService
  ) { }

  register() {
    this.authService.register(this.student).subscribe({
      next: () => {
        this.toast.show('Registration Successful! Redirecting to login...', 'success');
        setTimeout(() => this.router.navigate(['/login']), 5000);
      },
      error: err => {
        const errorMsg = err.error?.message || 'Registration failed! Try again.';
        this.toast.show(errorMsg, 'error');
      }
    });
  }
}
