import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-manage-reviews',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './manage-reviews.component.html',
  styleUrls: ['./manage-reviews.component.scss']
})
export class ManageReviewsComponent implements OnInit {
  reviews: any[] = [];
  loading = true;
  error: string | null = null;
  apiUrl = 'http://localhost:8081/backend/reviews';
  companyReply: { [key: number]: string } = {};

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    console.log('ManageReviewsComponent initialized');
    this.loadReviews();
  }

  loadReviews() {
    this.loading = true;
    this.error = null;

    const company = JSON.parse(localStorage.getItem('user') || '{}');
    console.log('Company read from localStorage:', company);

    const companyId = (company && company.companyId) ? company.companyId : company.id;

    console.log('Using companyId for API calls:', companyId);

    if (!companyId) {
      console.error('Company ID is missing!');
      this.error = 'No company ID found in localStorage';
      this.loading = false;
      return;
    }

    if (company.role !== 'COMPANY') {
      console.error('User is not a company:', company.role);
      this.error = 'Unauthorized';
      this.loading = false;
      return;
    }
    const endpoint = `${this.apiUrl}/get_company_reviews.php?company_id=${companyId}`;
    console.log('Fetching reviews from endpoint:', endpoint);

    this.http.get<any[]>(endpoint).subscribe({
      next: (res) => {
        console.log('Response from get_company_reviews.php:', res);
        this.reviews = res || [];
        this.loading = false;

        if (this.reviews.length === 0) {
          console.warn('No reviews returned from API for company ID', companyId);
        }
      },
      error: (err) => {
        console.error('Failed to load reviews:', err);
        this.error = 'Failed to load reviews';
        this.loading = false;
      }
    });
  }

  submitReply(reviewId: number) {
    const reply = this.companyReply[reviewId];
    if (!reply) return;

    const endpoint = `${this.apiUrl}/reply_review.php`;
    console.log('Submitting reply to:', endpoint, 'reviewId:', reviewId, 'reply:', reply);

    this.http.post(endpoint, { review_id: reviewId, employer_reply: reply }).subscribe({
      next: (res: any) => {
        console.log('Reply submitted successfully:', res);
        const review = this.reviews.find(r => r.id === reviewId);
        if (review) review.employer_reply = reply;
        this.companyReply[reviewId] = '';
      },
      error: (err) => {
        console.error('Failed to submit reply', err);
      }
    });
  }
}
