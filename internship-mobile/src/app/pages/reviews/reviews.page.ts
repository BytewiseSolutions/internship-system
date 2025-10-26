import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonButton, IonIcon, IonBackButton, IonButtons, IonModal, IonItem, IonLabel, IonSelect, IonSelectOption, IonTextarea, IonToast } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { addOutline, starOutline, closeOutline, star } from 'ionicons/icons';
import { ReviewService } from '../../services/review.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-reviews',
  templateUrl: './reviews.page.html',
  styleUrls: ['./reviews.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, IonHeader, IonToolbar, IonTitle, IonContent, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonButton, IonIcon, IonBackButton, IonButtons, IonModal, IonItem, IonLabel, IonSelect, IonSelectOption, IonTextarea, IonToast]
})
export class ReviewsPage implements OnInit {
  reviews: any[] = [];
  completedInternships: any[] = [];
  isLoading: boolean = true;
  isModalOpen: boolean = false;
  showToast: boolean = false;
  toastMessage: string = '';
  toastColor: string = 'success';

  // Form data
  selectedInternshipId: number | null = null;
  rating: number = 5;
  reviewText: string = '';
  editingReviewId: number | null = null;
  isEditing: boolean = false;

  constructor(
    private reviewService: ReviewService,
    private authService: AuthService
  ) {
    addIcons({ addOutline, starOutline, closeOutline, star });
  }

  ngOnInit() {
    this.loadReviews();
    this.loadCompletedInternships();
  }

  loadReviews() {
    const user = this.authService.getCurrentUser();
    const userId = user?.id;
    
    if (userId) {
      this.reviewService.getStudentReviews(userId).subscribe({
        next: (response) => {
          this.reviews = response.success ? response.reviews : [];
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error loading reviews:', error);
          this.reviews = [];
          this.isLoading = false;
        }
      });
    } else {
      this.isLoading = false;
    }
  }

  loadCompletedInternships() {
    const user = this.authService.getCurrentUser();
    const userId = user?.id;
    
    console.log('Loading completed internships for user ID:', userId);
    
    if (userId) {
      this.reviewService.getCompletedInternships(userId).subscribe({
        next: (response) => {
          this.completedInternships = response.success ? response.internships : [];
        },
        error: (error) => {
          console.error('Error loading completed internships:', error);
          this.completedInternships = [];
        }
      });
    }
  }

  addReview() {
    if (this.completedInternships.length === 0) {
      this.showToastMessage('No completed internships available for review. You need to have accepted applications first.', 'warning');
      return;
    }
    this.resetForm();
    this.isEditing = false;
    this.isModalOpen = true;
  }

  editReview(review: any) {
    this.selectedInternshipId = review.internship_id;
    this.rating = review.rating;
    this.reviewText = review.review_text;
    this.editingReviewId = review.review_id;
    this.isEditing = true;
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
    this.resetForm();
  }

  saveReview() {
    if ((!this.isEditing && !this.selectedInternshipId) || !this.reviewText.trim()) {
      this.showToastMessage('Please fill in all required fields', 'warning');
      return;
    }

    if (this.isEditing) {
      const reviewData = {
        review_id: this.editingReviewId,
        rating: this.rating,
        review_text: this.reviewText
      };

      this.reviewService.updateReview(reviewData).subscribe({
        next: (response) => {
          if (response.success) {
            this.showToastMessage('Review updated successfully!', 'success');
            this.loadReviews();
            this.closeModal();
          } else {
            this.showToastMessage(response.message || 'Failed to update review', 'danger');
          }
        },
        error: (error) => {
          console.error('Error updating review:', error);
          this.showToastMessage('Network error. Please try again.', 'danger');
        }
      });
    } else {
      const user = this.authService.getCurrentUser();
      const userId = user?.id;
      
      if (!userId) {
        this.showToastMessage('User ID not found', 'danger');
        return;
      }

      const reviewData = {
        user_id: userId,
        internship_id: this.selectedInternshipId,
        rating: this.rating,
        review_text: this.reviewText
      };

      this.reviewService.addReview(reviewData).subscribe({
        next: (response) => {
          if (response.success) {
            this.showToastMessage('Review added successfully!', 'success');
            this.loadReviews();
            this.closeModal();
          } else {
            this.showToastMessage(response.message || 'Failed to save review', 'danger');
          }
        },
        error: (error) => {
          console.error('Error saving review:', error);
          this.showToastMessage('Network error. Please try again.', 'danger');
        }
      });
    }
  }

  getStarArray(rating: number): number[] {
    return Array(5).fill(0).map((_, i) => i + 1);
  }

  setRating(rating: number) {
    this.rating = rating;
  }

  private resetForm() {
    this.selectedInternshipId = null;
    this.rating = 5;
    this.reviewText = '';
    this.editingReviewId = null;
    this.isEditing = false;
  }

  private showToastMessage(message: string, color: string) {
    this.toastMessage = message;
    this.toastColor = color;
    this.showToast = true;
  }
}