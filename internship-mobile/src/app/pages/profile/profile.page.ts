import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonContent, IonHeader, IonToolbar, IonTitle, IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonButton, IonIcon, IonItem, IonLabel, IonModal, IonButtons, IonInput, IonSelect, IonSelectOption, IonToast } from '@ionic/angular/standalone';
import { FormsModule } from '@angular/forms';
import { addIcons } from 'ionicons';
import { personOutline, mailOutline, schoolOutline, logOutOutline, closeOutline } from 'ionicons/icons';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, IonContent, IonHeader, IonToolbar, IonTitle, IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonButton, IonIcon, IonItem, IonLabel, IonModal, IonButtons, IonInput, IonSelect, IonSelectOption, IonToast]
})
export class ProfilePage implements OnInit {
  user: any = {};
  isEditModalOpen = false;
  editForm = {
    name: '',
    email: ''
  };
  showToast = false;
  toastMessage = '';
  toastColor = 'success';

  constructor(private router: Router, private authService: AuthService) {
    addIcons({ personOutline, mailOutline, schoolOutline, logOutOutline, closeOutline });
  }

  ngOnInit() {
    this.user = this.authService.getCurrentUser() || {};
  }

  openEditModal() {
    this.editForm.name = this.user.name || '';
    this.editForm.email = this.user.email || '';
    this.isEditModalOpen = true;
  }

  closeEditModal() {
    this.isEditModalOpen = false;
  }

  saveProfile() {
    if (!this.editForm.name.trim() || !this.editForm.email.trim()) {
      this.showToastMessage('Please fill in all fields', 'warning');
      return;
    }

    const currentUser = this.authService.getCurrentUser();
    if (!currentUser?.id) {
      this.showToastMessage('User not found', 'danger');
      return;
    }

    const updateData = {
      user_id: currentUser.id,
      name: this.editForm.name,
      email: this.editForm.email
    };

    this.authService.updateProfile(updateData).subscribe({
      next: (response) => {
        if (response.success) {
          this.user.name = this.editForm.name;
          this.user.email = this.editForm.email;
          this.showToastMessage('Profile updated successfully!', 'success');
          this.closeEditModal();
        } else {
          this.showToastMessage(response.message || 'Failed to update profile', 'danger');
        }
      },
      error: (error) => {
        console.error('Error updating profile:', error);
        this.showToastMessage('Network error. Please try again.', 'danger');
      }
    });
  }

  private showToastMessage(message: string, color: string) {
    this.toastMessage = message;
    this.toastColor = color;
    this.showToast = true;
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/landing']);
  }
}