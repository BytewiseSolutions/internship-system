import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { StudentHeaderComponent } from '../../../components/student/student-header/student-header.component';
import { StudentSidebarComponent } from '../../../components/student/student-sidebar/student-sidebar.component';

interface Review {
  review_id: number;
  rating: number;
  review_text: string;
  created_at: string;
  company_name: string;
  internship_title: string;
}

interface CompletedInternship {
  application_id: number;
  internship_id: number;
  internship_title: string;
  company_id: number;
  company_name: string;
  deadline: string;
}

@Component({
  selector: 'app-reviews',
  standalone: true,
  imports: [CommonModule, FormsModule, StudentHeaderComponent, StudentSidebarComponent],
  templateUrl: './reviews.component.html',
  styleUrls: ['./reviews.component.scss']
})
export class ReviewsComponent implements OnInit {
  isSidebarCollapsed = false;
  reviews: Review[] = [];
  completedInternships: CompletedInternship[] = [];
  loading = true;
  error = '';
  showAddForm = false;
  selectedInternship: CompletedInternship | null = null;
  
  newReview = {
    rating: 5,
    review_text: ''
  };

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.loadReviews();
    this.loadCompletedInternships();
  }

  onSidebarCollapseChanged(collapsed: boolean) {
    this.isSidebarCollapsed = collapsed;
  }

  loadReviews() {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const userId = user.id;
    if (!userId) return;

    this.http.get<any>(`${environment.apiUrl}/reviews/get_student_reviews.php?user_id=${userId}`)
      .subscribe({
        next: (response) => {
          if (response.success) {
            this.reviews = response.reviews;
          }
          this.loading = false;
        },
        error: () => {
          this.loading = false;
        }
      });
  }

  loadCompletedInternships() {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const userId = user.id;
    if (!userId) return;

    this.http.get<any>(`${environment.apiUrl}/reviews/get_completed_internships.php?user_id=${userId}`)
      .subscribe({
        next: (response) => {
          if (response.success) {
            this.completedInternships = response.internships;
          }
        },
        error: () => {}
      });
  }

  startReview(internship: CompletedInternship) {
    this.selectedInternship = internship;
    this.newReview = { rating: 5, review_text: '' };
    this.showAddForm = true;
  }

  submitReview() {
    if (!this.selectedInternship) return;
    
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const userId = user.id;
    if (!userId) return;

    const payload = {
      user_id: userId,
      internship_id: this.selectedInternship.internship_id,
      rating: this.newReview.rating,
      review_text: this.newReview.review_text
    };

    this.http.post<any>(`${environment.apiUrl}/reviews/add_review.php`, payload)
      .subscribe({
        next: (response) => {
          if (response.success) {
            this.showAddForm = false;
            this.selectedInternship = null;
            this.loadReviews();
            this.loadCompletedInternships();
          } else {
            this.error = response.message;
          }
        },
        error: () => {
          this.error = 'Failed to submit review';
        }
      });
  }

  cancelReview() {
    this.showAddForm = false;
    this.selectedInternship = null;
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString();
  }

  getStars(rating: number): string[] {
    return Array(5).fill('').map((_, i) => i < rating ? 'fas fa-star' : 'far fa-star');
  }
}