import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonButton, IonIcon, IonChip, IonLabel, IonBackButton, IonButtons } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { businessOutline, locationOutline, calendarOutline, bookOutline, starOutline } from 'ionicons/icons';
import { ApplicationService } from '../../services/application.service';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-my-internship',
  templateUrl: './my-internship.page.html',
  styleUrls: ['./my-internship.page.scss'],
  standalone: true,
  imports: [CommonModule, IonHeader, IonToolbar, IonTitle, IonContent, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonButton, IonIcon, IonChip, IonLabel, IonBackButton, IonButtons]
})
export class MyInternshipPage implements OnInit {
  internship: any = null;
  isLoading: boolean = true;

  constructor(
    private applicationService: ApplicationService,
    private authService: AuthService,
    private router: Router
  ) {
    addIcons({ businessOutline, locationOutline, calendarOutline, bookOutline, starOutline });
  }

  ngOnInit() {
    this.loadAcceptedInternship();
  }

  loadAcceptedInternship() {
    const user = this.authService.getCurrentUser();
    const userId = user?.id;
    
    if (userId) {
      this.applicationService.getStudentApplications(userId).subscribe({
        next: (response) => {
          if (response.success) {
            // Find accepted application
            const acceptedApp = response.applications.find((app: any) => app.status === 'ACCEPTED');
            this.internship = acceptedApp || null;
          }
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error loading internship:', error);
          this.isLoading = false;
        }
      });
    } else {
      this.isLoading = false;
    }
  }

  openLogbook() {
    this.router.navigate(['/logbook']);
  }

  openReviews() {
    this.router.navigate(['/reviews']);
  }
}