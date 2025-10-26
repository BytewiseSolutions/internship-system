import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { IonContent, IonHeader, IonToolbar, IonTitle, IonButton, IonInput, IonItem, IonLabel, IonIcon, IonBackButton, IonButtons } from '@ionic/angular/standalone';
import { FormsModule } from '@angular/forms';
import { addIcons } from 'ionicons';
import { mailOutline, lockClosedOutline } from 'ionicons/icons';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonToolbar, IonTitle, IonButton, IonInput, IonItem, IonLabel, IonIcon, IonBackButton, IonButtons, FormsModule]
})
export class LoginPage {
  email: string = '';
  password: string = '';

  constructor(private router: Router) {
    addIcons({ mailOutline, lockClosedOutline });
  }

  login() {
    // TODO: Implement login logic
    console.log('Login:', this.email, this.password);
    this.router.navigate(['/tabs']);
  }

  goToRegister() {
    this.router.navigate(['/register']);
  }
}