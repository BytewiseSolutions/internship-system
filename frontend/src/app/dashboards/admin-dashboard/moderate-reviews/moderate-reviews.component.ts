// import { Component, OnInit } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { HttpClient } from '@angular/common/http';
// import { FormsModule } from '@angular/forms';

// @Component({
//   selector: 'app-moderate-reviews',
//   standalone: true,
//   imports: [CommonModule, FormsModule],
//   templateUrl: './moderate-reviews.component.html',
//   styleUrls: ['./moderate-reviews.component.scss']
// })
// export class ModerateReviewsComponent implements OnInit {
//   reviews: any[] = [];
//   loading = true;
//   error: string | null = null;
//   apiUrl = 'http://localhost:8081/backend/reviews';

//   constructor(private http: HttpClient) { }

//   ngOnInit(): void {
//     this.loadReviews();
//   }

//   loadReviews() {
//     this.loading = true;
//     this.error = null;

//     this.http.get<any>(`${this.apiUrl}/get_reviews.php?role=ADMIN`).subscribe({
//       next: (res) => {
//         this.reviews = res.reviews || [];
//         this.loading = false;
//       },
//       error: (err) => {
//         this.error = 'Failed to load reviews';
//         console.error(err);
//         this.loading = false;
//       }
//     });
//   }

//   approveReview(reviewId: number) {
//     this.updateReviewStatus(reviewId, 'APPROVED');
//   }

//   rejectReview(reviewId: number) {
//     this.updateReviewStatus(reviewId, 'REJECTED');
//   }

//   deleteReview(reviewId: number) {
//     this.http.post(`${this.apiUrl}/delete_review.php`, { review_id: reviewId })
//       .subscribe({
//         next: () => this.loadReviews(),
//         error: (err) => console.error(err)
//       });
//   }

//   updateReviewStatus(reviewId: number, status: string) {
//     this.http.post(`${this.apiUrl}/moderate_review.php`, { review_id: reviewId, status })
//       .subscribe({
//         next: () => this.loadReviews(),
//         error: (err) => console.error(err)
//       });
//   }
// }

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

interface Review {
  id: number;
  student_name: string;
  internship_title: string;
  rating: number;
  comment: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  created_at?: string;
}

@Component({
  selector: 'app-moderate-reviews',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './moderate-reviews.component.html',
  styleUrls: ['./moderate-reviews.component.scss']
})
export class ModerateReviewsComponent implements OnInit {
  reviews: Review[] = [];
  loading = true;
  error: string | null = null;
  apiUrl = 'http://localhost:8081/backend/reviews';

  // Statistics
  stats = {
    total: 0,
    pending: 0,
    approved: 0,
    rejected: 0
  };

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.loadReviews();
  }

  loadReviews() {
    this.loading = true;
    this.error = null;

    this.http.get<any>(`${this.apiUrl}/get_reviews.php?role=ADMIN`).subscribe({
      next: (res) => {
        this.reviews = res.reviews || [];
        this.calculateStats();
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load reviews. Please try again later.';
        console.error(err);
        this.loading = false;
      }
    });
  }

  calculateStats(): void {
    this.stats.total = this.reviews.length;
    this.stats.pending = this.reviews.filter(review => review.status === 'PENDING').length;
    this.stats.approved = this.reviews.filter(review => review.status === 'APPROVED').length;
    this.stats.rejected = this.reviews.filter(review => review.status === 'REJECTED').length;
  }

  approveReview(reviewId: number) {
    this.updateReviewStatus(reviewId, 'APPROVED');
  }

  rejectReview(reviewId: number) {
    this.updateReviewStatus(reviewId, 'REJECTED');
  }

  deleteReview(reviewId: number) {
    if (confirm('Are you sure you want to delete this review? This action cannot be undone.')) {
      this.http.post(`${this.apiUrl}/delete_review.php`, { review_id: reviewId })
        .subscribe({
          next: () => {
            this.loadReviews();
            // You could add a toast notification here
          },
          error: (err) => {
            console.error(err);
            this.error = 'Failed to delete review. Please try again.';
          }
        });
    }
  }

  updateReviewStatus(reviewId: number, status: string) {
    this.http.post(`${this.apiUrl}/moderate_review.php`, { review_id: reviewId, status })
      .subscribe({
        next: () => {
          this.loadReviews();
          
        },
        error: (err) => {
          console.error(err);
          this.error = `Failed to ${status.toLowerCase()} review. Please try again.`;
        }
      });
  }

  getStatusClass(status: string): string {
    return `status-${status.toLowerCase()}`;
  }

  getStarRating(rating: number): string {
    return '⭐'.repeat(rating) + '☆'.repeat(5 - rating);
  }
}