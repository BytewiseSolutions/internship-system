import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-moderate-reviews',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './moderate-reviews.component.html',
  styleUrls: ['./moderate-reviews.component.scss']
})
export class ModerateReviewsComponent implements OnInit {
  reviews: any[] = [];
  loading = true;
  error: string | null = null;
  apiUrl = 'http://localhost:8081/reviews';

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
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load reviews';
        console.error(err);
        this.loading = false;
      }
    });
  }

  approveReview(reviewId: number) {
    this.updateReviewStatus(reviewId, 'APPROVED');
  }

  rejectReview(reviewId: number) {
    this.updateReviewStatus(reviewId, 'REJECTED');
  }

  deleteReview(reviewId: number) {
    this.http.post(`${this.apiUrl}/delete_review.php`, { review_id: reviewId })
      .subscribe({
        next: () => this.loadReviews(),
        error: (err) => console.error(err)
      });
  }

  updateReviewStatus(reviewId: number, status: string) {
    this.http.post(`${this.apiUrl}/moderate_review.php`, { review_id: reviewId, status })
      .subscribe({
        next: () => this.loadReviews(),
        error: (err) => console.error(err)
      });
  }
}
