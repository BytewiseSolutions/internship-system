import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonButton, IonIcon, IonBackButton, IonButtons, IonItem, IonLabel, IonInput, IonToast } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { documentOutline, cloudUploadOutline } from 'ionicons/icons';
import { AuthService } from '../../services/auth.service';
import { ApplicationService } from '../../services/application.service';

@Component({
  selector: 'app-apply',
  templateUrl: './apply.page.html',
  styleUrls: ['./apply.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, IonHeader, IonToolbar, IonTitle, IonContent, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonButton, IonIcon, IonBackButton, IonButtons, IonItem, IonLabel, IonInput, IonToast]
})
export class ApplyPage implements OnInit {
  internship: any = null;
  isLoading: boolean = false;
  showToast: boolean = false;
  toastMessage: string = '';
  toastColor: string = 'success';
  
  // File inputs
  cvFile: File | null = null;
  transcriptFile: File | null = null;
  applicationLetterFile: File | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private applicationService: ApplicationService
  ) {
    addIcons({ documentOutline, cloudUploadOutline });
  }

  ngOnInit() {
    const internshipData = this.route.snapshot.queryParams['data'];
    if (internshipData) {
      this.internship = JSON.parse(internshipData);
    }
  }

  onFileSelected(event: any, fileType: string) {
    const file = event.target.files[0];
    if (file) {
      switch (fileType) {
        case 'cv':
          this.cvFile = file;
          break;
        case 'transcript':
          this.transcriptFile = file;
          break;
        case 'applicationLetter':
          this.applicationLetterFile = file;
          break;
      }
    }
  }

  submitApplication() {
    if (!this.cvFile || !this.transcriptFile || !this.applicationLetterFile) {
      this.showToastMessage('Please upload all required documents', 'warning');
      return;
    }

    this.isLoading = true;
    
    const formData = new FormData();
    const user = this.authService.getCurrentUser();
    
    formData.append('internship_id', this.internship.id);
    formData.append('student_id', user.student_id || user.id);
    formData.append('cv', this.cvFile);
    formData.append('transcript', this.transcriptFile);
    formData.append('letter', this.applicationLetterFile);

    this.applicationService.submitApplication(formData).subscribe({
      next: (response) => {
        this.isLoading = false;
        if (response.success) {
          this.showToastMessage('Application submitted successfully!', 'success');
          setTimeout(() => {
            this.router.navigate(['/tabs/applications']);
          }, 2000);
        } else {
          this.showToastMessage(response.message || 'Application failed', 'danger');
        }
      },
      error: (error) => {
        this.isLoading = false;
        console.error('Application error:', error);
        this.showToastMessage('Network error. Please try again.', 'danger');
      }
    });
  }

  private showToastMessage(message: string, color: string) {
    this.toastMessage = message;
    this.toastColor = color;
    this.showToast = true;
  }
}