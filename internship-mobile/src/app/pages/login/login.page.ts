import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { IonContent, IonHeader, IonToolbar, IonTitle, IonButton, IonInput, IonItem, IonLabel, IonIcon, IonBackButton, IonButtons, IonToast } from '@ionic/angular/standalone';
import { FormsModule } from '@angular/forms';
import { addIcons } from 'ionicons';
import { mailOutline, lockClosedOutline } from 'ionicons/icons';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [CommonModule, IonContent, IonHeader, IonToolbar, IonTitle, IonButton, IonInput, IonItem, IonLabel, IonIcon, IonBackButton, IonButtons, IonToast, FormsModule]
})
export class LoginPage {
  email: string = '';
  password: string = '';
  isLoading: boolean = false;
  showToast: boolean = false;
  toastMessage: string = '';
  toastColor: string = 'danger';

  constructor(private router: Router, private authService: AuthService) {
    addIcons({ mailOutline, lockClosedOutline });
  }

  login() {
    if (!this.email || !this.password) {
      this.showToastMessage('Please fill in all fields', 'warning');
      return;
    }

    this.isLoading = true;
    this.authService.login(this.email, this.password).subscribe({
      next: (response) => {
        this.isLoading = false;
        if (response.message === 'Login successful') {
          // Only allow students to access mobile app
          if (response.role !== 'STUDENT') {
            this.showToastMessage('Mobile app is only for students', 'warning');
            return;
          }
          this.showToastMessage('Login successful!', 'success');
          setTimeout(() => {
            this.router.navigate(['/tabs/home']);
          }, 1000);
        } else {
          this.showToastMessage(response.message || 'Login failed', 'danger');
        }
      },
      error: (error) => {
        this.isLoading = false;
        this.showToastMessage(error.error?.message || 'Network error. Please try again.', 'danger');
      }
    });
  }

  goToRegister() {
    this.router.navigate(['/register']);
  }

  private showToastMessage(message: string, color: string) {
    this.toastMessage = message;
    this.toastColor = color;
    this.showToast = true;
  }
}