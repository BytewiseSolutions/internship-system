import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonContent, IonHeader, IonToolbar, IonTitle, IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonButton, IonIcon, IonGrid, IonRow, IonCol } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { briefcaseOutline, documentTextOutline, personOutline, searchOutline } from 'ionicons/icons';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: true,
  imports: [CommonModule, IonContent, IonHeader, IonToolbar, IonTitle, IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonButton, IonIcon, IonGrid, IonRow, IonCol]
})
export class HomePage implements OnInit {
  studentName: string = '';

  constructor(private router: Router, private authService: AuthService) {
    addIcons({ briefcaseOutline, documentTextOutline, personOutline, searchOutline });
  }

  ngOnInit() {
    const user = this.authService.getCurrentUser();
    this.studentName = user?.name || 'Student';
  }

  navigateToInternships() {
    this.router.navigate(['/tabs/internships']);
  }

  navigateToApplications() {
    this.router.navigate(['/tabs/applications']);
  }

  navigateToProfile() {
    this.router.navigate(['/tabs/profile']);
  }

  navigateToMyInternship() {
    this.router.navigate(['/my-internship']);
  }
}