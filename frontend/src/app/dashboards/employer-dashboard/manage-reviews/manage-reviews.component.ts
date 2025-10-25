import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { EmployerSidebarComponent } from '../../../components/employer/employer-sidebar/employer-sidebar.component';
import { EmployerHeaderComponent } from '../../../components/employer/employer-header/employer-header.component';

@Component({
  selector: 'app-manage-reviews',
  standalone: true,
  imports: [CommonModule, EmployerSidebarComponent, EmployerHeaderComponent],
  templateUrl: './manage-reviews.component.html',
  styleUrls: ['./manage-reviews.component.scss']
})
export class ManageReviewsComponent implements OnInit {
  isSidebarCollapsed = false;
  reviews: any[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadReviews();
  }

  onSidebarCollapseChanged(collapsed: boolean): void {
    this.isSidebarCollapsed = collapsed;
  }

  loadReviews(): void {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    this.http.get(`http://localhost:8000/reviews/get_reviews.php?company_id=${user.companyId}`)
      .subscribe({
        next: (response: any) => {
          this.reviews = response.reviews || [];
        },
        error: (error) => {
          console.error('Error loading reviews:', error);
        }
      });
  }

  getStars(rating: number): number[] {
    return [1, 2, 3, 4, 5];
  }
}