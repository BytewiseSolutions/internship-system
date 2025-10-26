import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonContent, IonHeader, IonToolbar, IonTitle, IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonButton, IonIcon, IonItem, IonLabel } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { personOutline, mailOutline, schoolOutline, logOutOutline } from 'ionicons/icons';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
  standalone: true,
  imports: [CommonModule, IonContent, IonHeader, IonToolbar, IonTitle, IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonButton, IonIcon, IonItem, IonLabel]
})
export class ProfilePage implements OnInit {
  user: any = {};

  constructor(private router: Router, private authService: AuthService) {
    addIcons({ personOutline, mailOutline, schoolOutline, logOutOutline });
  }

  ngOnInit() {
    this.user = this.authService.getCurrentUser() || {};
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/landing']);
  }
}