import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ReviewService {
  private apiUrl = 'http://localhost:8000';

  constructor(private http: HttpClient) {}

  addReview(reviewData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/reviews/add_review.php`, reviewData);
  }

  getStudentReviews(userId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/reviews/get_student_reviews.php?user_id=${userId}`);
  }

  getCompletedInternships(userId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/reviews/get_completed_internships.php?user_id=${userId}`);
  }

  updateReview(reviewData: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/reviews/update_review.php`, reviewData);
  }
}