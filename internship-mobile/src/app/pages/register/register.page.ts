import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { IonContent, IonHeader, IonToolbar, IonTitle, IonButton, IonInput, IonItem, IonLabel, IonIcon, IonBackButton, IonButtons } from '@ionic/angular/standalone';
import { FormsModule } from '@angular/forms';
import { addIcons } from 'ionicons';
import { personOutline, mailOutline, lockClosedOutline } from 'ionicons/icons';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonToolbar, IonTitle, IonButton, IonInput, IonItem, IonLabel, IonIcon, IonBackButton, IonButtons, FormsModule]
})
export class RegisterPage {
  name: string = '';
  email: string = '';
  password: string = '';
  confirmPassword: string = '';

  constructor(private router: Router) {
    addIcons({ personOutline, mailOutline, lockClosedOutline });
  }

  register() {
    // TODO: Implement registration logic
    console.log('Register:', this.name, this.email, this.password);
    this.router.navigate(['/tabs']);
  }

  goToLogin() {
    this.router.navigate(['/login']);
  }
}