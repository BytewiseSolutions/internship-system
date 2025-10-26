import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonContent, IonHeader, IonToolbar, IonTitle, IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonButton, IonIcon, IonGrid, IonRow, IonCol } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { briefcaseOutline, documentTextOutline, personOutline, searchOutline, search, listOutline, businessOutline } from 'ionicons/icons';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ApplicationService } from '../../services/application.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: true,
  imports: [CommonModule, IonContent, IonHeader, IonToolbar, IonTitle, IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonButton, IonIcon, IonGrid, IonRow, IonCol]
})
export class HomePage implements OnInit {
  studentName: string = '';
  stats = {
    applications: 0,
    accepted: 0,
    pending: 0,
    rejected: 0,
    interviews: 0,
    logbookEntries: 0
  };

  constructor(private router: Router, private authService: AuthService, private applicationService: ApplicationService) {
    addIcons({ briefcaseOutline, documentTextOutline, personOutline, searchOutline, search, listOutline, businessOutline });
  }

  ngOnInit() {
    const user = this.authService.getCurrentUser();
    this.studentName = user?.name || 'Student';
    this.loadStats();
  }

  loadStats() {
    const user = this.authService.getCurrentUser();
    if (user?.id) {
      this.applicationService.getStudentApplications(user.id).subscribe({
        next: (response) => {
          if (response.success && response.applications) {
            this.stats.applications = response.applications.length;
            this.stats.accepted = response.applications.filter((app: any) => app.status === 'ACCEPTED').length;
            this.stats.pending = response.applications.filter((app: any) => app.status === 'PENDING').length;
            this.stats.rejected = response.applications.filter((app: any) => app.status === 'REJECTED').length;
            this.stats.interviews = response.applications.filter((app: any) => app.interview_scheduled).length;
          }
        },
        error: (error) => {
          console.error('Error loading stats:', error);
        }
      });
    }
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