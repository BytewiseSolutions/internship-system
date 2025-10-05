import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { ToastService } from '../../../services/toast.service';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-create-reviews',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './create-reviews.component.html',
  styleUrls: ['./create-reviews.component.scss']
})
export class CreateReviewsComponent implements OnInit {
  internships: any[] = [];
  selectedInternshipId: number | null = null;
  rating: number = 0;
  comment: string = '';

  private baseUrl = environment.apiUrl;

  constructor(
    private http: HttpClient,
    private toastService: ToastService
  ) { }

  ngOnInit(): void {
    this.loadAcceptedInternships();
  }

  loadAcceptedInternships() {
    const student = JSON.parse(localStorage.getItem('user') || '{}');
    if (!student || student.role !== 'STUDENT') return;

    this.http
      .get<any[]>(`${this.baseUrl}/applications/accepted_internships.php?student_id=${student.id}`)
      .subscribe({
        next: data => (this.internships = data),
        error: () => this.toastService.show('Failed to load internships', 'error')
      });
  }

  getRatingText(rating: number): string {
    const ratingTexts: { [key: number]: string } = {
      1: 'Poor',
      2: 'Fair',
      3: 'Average',
      4: 'Good',
      5: 'Excellent'
    };
    return ratingTexts[rating] || '';
  }

  isFormValid(): boolean {
    return !!this.selectedInternshipId && this.rating >= 1 && this.rating <= 5 && this.comment.trim().length > 0;
  }

  resetForm() {
    this.selectedInternshipId = null;
    this.rating = 0;
    this.comment = '';
  }

  submitReview() {
    if (!this.isFormValid()) {
      this.toastService.show('Please fill all fields correctly', 'error');
      return;
    }

    const student = JSON.parse(localStorage.getItem('user') || '{}');

    const payload = {
      student_id: student.id,
      internship_id: this.selectedInternshipId,
      rating: this.rating,
      comment: this.comment
    };

    this.http.post(`${this.baseUrl}/reviews/create_review.php`, payload).subscribe({
      next: (res: any) => {
        this.toastService.show(res.message || 'Review submitted successfully', 'success');
        this.resetForm();
      },
      error: (err) => this.toastService.show(err.error.message || 'Error submitting review', 'error')
    });
  }
}
