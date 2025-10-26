import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonButton, IonIcon, IonBackButton, IonButtons, IonModal, IonItem, IonLabel, IonInput, IonTextarea, IonToast } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { addOutline, closeOutline, createOutline } from 'ionicons/icons';
import { LogbookService } from '../../services/logbook.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-logbook',
  templateUrl: './logbook.page.html',
  styleUrls: ['./logbook.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, IonHeader, IonToolbar, IonTitle, IonContent, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonButton, IonIcon, IonBackButton, IonButtons, IonModal, IonItem, IonLabel, IonInput, IonTextarea, IonToast]
})
export class LogbookPage implements OnInit {
  logbookEntries: any[] = [];
  isLoading: boolean = true;
  isModalOpen: boolean = false;
  showToast: boolean = false;
  toastMessage: string = '';
  toastColor: string = 'success';

  // Form data
  weekNumber: number = 1;
  weekEnding: string = '';
  activitiesCompleted: string = '';
  skillsLearned: string = '';
  challengesFaced: string = '';
  editingEntry: any = null;
  isEditing: boolean = false;

  constructor(
    private logbookService: LogbookService,
    private authService: AuthService
  ) {
    addIcons({ addOutline, closeOutline, createOutline });
  }

  ngOnInit() {
    this.loadLogbookEntries();
    this.setDefaultWeekEnding();
  }

  loadLogbookEntries() {
    const user = this.authService.getCurrentUser();
    const userId = user?.id;
    
    if (userId) {
      this.logbookService.getStudentLogbook(userId).subscribe({
        next: (response) => {
          if (response.success) {
            this.logbookEntries = response.entries || [];
          } else {
            this.logbookEntries = [];
          }
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error loading logbook:', error);
          this.logbookEntries = [];
          this.isLoading = false;
        }
      });
    } else {
      this.isLoading = false;
    }
  }

  addEntry() {
    this.isEditing = false;
    this.editingEntry = null;
    this.resetForm();
    this.isModalOpen = true;
  }

  editEntry(entry: any) {
    this.isEditing = true;
    this.editingEntry = entry;
    this.weekNumber = entry.week_number;
    this.weekEnding = entry.week_ending;
    this.activitiesCompleted = entry.activities_completed;
    this.skillsLearned = entry.skills_learned;
    this.challengesFaced = entry.challenges_faced || '';
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
    this.resetForm();
  }

  saveEntry() {
    if (!this.weekEnding || !this.activitiesCompleted || !this.skillsLearned) {
      this.showToastMessage('Please fill in all required fields', 'warning');
      return;
    }

    const user = this.authService.getCurrentUser();
    const userId = user?.id;
    
    if (!userId) {
      this.showToastMessage('User ID not found', 'danger');
      return;
    }

    const entryData = {
      user_id: userId,
      week_number: this.weekNumber,
      week_ending: this.weekEnding,
      activities_completed: this.activitiesCompleted,
      skills_learned: this.skillsLearned,
      challenges_faced: this.challengesFaced
    };

    if (this.isEditing && this.editingEntry) {
      // Update existing entry
      const updateData = { ...entryData, logbook_id: this.editingEntry.logbook_id };
      this.logbookService.updateLogbookEntry(updateData).subscribe({
        next: (response) => {
          if (response.success) {
            this.showToastMessage('Logbook entry updated successfully!', 'success');
            this.loadLogbookEntries();
            this.closeModal();
          } else {
            this.showToastMessage(response.message || 'Failed to update entry', 'danger');
          }
        },
        error: (error) => {
          console.error('Error updating logbook entry:', error);
          this.showToastMessage('Network error. Please try again.', 'danger');
        }
      });
    } else {
      // Add new entry
      this.logbookService.addLogbookEntry(entryData).subscribe({
        next: (response) => {
          if (response.success) {
            this.showToastMessage('Logbook entry added successfully!', 'success');
            this.loadLogbookEntries();
            this.closeModal();
          } else {
            this.showToastMessage(response.message || 'Failed to save entry', 'danger');
          }
        },
        error: (error) => {
          console.error('Error saving logbook entry:', error);
          this.showToastMessage('Network error. Please try again.', 'danger');
        }
      });
    }
  }

  private resetForm() {
    this.weekNumber = this.logbookEntries.length + 1;
    this.weekEnding = '';
    this.activitiesCompleted = '';
    this.skillsLearned = '';
    this.challengesFaced = '';
    this.setDefaultWeekEnding();
  }

  private setDefaultWeekEnding() {
    const today = new Date();
    const dayOfWeek = today.getDay();
    const daysUntilFriday = (5 - dayOfWeek + 7) % 7;
    const friday = new Date(today);
    friday.setDate(today.getDate() + daysUntilFriday);
    this.weekEnding = friday.toISOString().split('T')[0];
  }

  private showToastMessage(message: string, color: string) {
    this.toastMessage = message;
    this.toastColor = color;
    this.showToast = true;
  }
}