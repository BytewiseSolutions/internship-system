import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { ToastService } from '../../../services/toast.service';

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
  apiUrl = 'http://localhost:8081/reviews';

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

    this.http.get<any[]>(`http://localhost:8081/applications/accepted_internships.php?student_id=${student.id}`)
      .subscribe({
        next: data => this.internships = data,
        error: err => this.toastService.show('Failed to load internships', 'error')
      });
  }

  submitReview() {
    if (!this.selectedInternshipId || this.rating < 1 || this.rating > 5 || !this.comment) {
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

    this.http.post(`${this.apiUrl}/create_review.php`, payload)
      .subscribe({
        next: (res: any) => this.toastService.show(res.message || 'Review submitted successfully', 'success'),
        error: (err) => this.toastService.show(err.error.message || 'Error submitting review', 'error')
      });
  }
}
