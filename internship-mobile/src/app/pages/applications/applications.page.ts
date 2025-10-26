import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonChip, IonLabel } from '@ionic/angular/standalone';
import { ApplicationService } from '../../services/application.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-applications',
  templateUrl: './applications.page.html',
  styleUrls: ['./applications.page.scss'],
  standalone: true,
  imports: [CommonModule, IonHeader, IonToolbar, IonTitle, IonContent, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonChip, IonLabel]
})
export class ApplicationsPage implements OnInit {
  applications: any[] = [];
  isLoading: boolean = true;

  constructor(
    private applicationService: ApplicationService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.loadApplications();
  }

  loadApplications() {
    const user = this.authService.getCurrentUser();
    const userId = user?.id;
    
    if (userId) {
      this.applicationService.getStudentApplications(userId).subscribe({
        next: (response) => {
          console.log('Applications response:', response);
          if (response.success) {
            this.applications = response.applications || [];
          } else {
            this.applications = [];
          }
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error loading applications:', error);
          this.applications = [];
          this.isLoading = false;
        }
      });
    } else {
      this.isLoading = false;
    }
  }

  getStatusColor(status: string): string {
    switch (status?.toUpperCase()) {
      case 'PENDING':
        return 'warning';
      case 'ACCEPTED':
        return 'success';
      case 'REJECTED':
        return 'danger';
      default:
        return 'medium';
    }
  }
}