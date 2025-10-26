import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { IonContent, IonButton, IonIcon, IonText, IonCard, IonCardContent } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { briefcaseOutline, peopleOutline, trendingUpOutline, checkmarkCircleOutline, arrowForwardOutline } from 'ionicons/icons';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.page.html',
  styleUrls: ['./landing.page.scss'],
  standalone: true,
  imports: [IonContent, IonButton, IonIcon, IonText, IonCard, IonCardContent]
})
export class LandingPage {

  constructor(private router: Router) {
    addIcons({
      briefcaseOutline,
      peopleOutline,
      trendingUpOutline,
      checkmarkCircleOutline,
      arrowForwardOutline
    });
  }

  navigateToLogin() {
    this.router.navigate(['/login']);
  }

  navigateToRegister() {
    this.router.navigate(['/register']);
  }
}