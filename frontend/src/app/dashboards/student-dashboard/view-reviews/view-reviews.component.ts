import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-view-reviews',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './view-reviews.component.html',
  styleUrls: ['./view-reviews.component.scss']
})
export class ViewReviewsComponent implements OnInit {
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

    const user = JSON.parse(localStorage.getItem('user') || '{}');
    let endpoint = `${this.apiUrl}/get_student_reviews.php`;

    if (user.role === 'STUDENT') {
      endpoint += `?student_id=${user.id}`;
    }

    this.http.get<any>(endpoint).subscribe({
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
}
