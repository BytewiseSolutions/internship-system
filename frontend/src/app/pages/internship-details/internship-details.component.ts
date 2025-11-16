import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { InternshipService } from '../../services/internship.service';

@Component({
  selector: 'app-internship-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './internship-details.component.html',
  styleUrls: ['./internship-details.component.scss']
})
export class InternshipDetailsComponent implements OnInit {
  internship: any = null;
  loading = true;
  error = '';
  hasAcceptedInternship = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient,
    private internshipService: InternshipService
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadInternshipDetails(id);
    }
    this.checkAcceptedStatus();
  }

  checkAcceptedStatus() {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (user?.id && user.role === 'STUDENT') {
      this.http.get(`${environment.apiUrl}/students/get_student_id.php?user_id=${user.id}`).subscribe({
        next: (response: any) => {
          if (response.student_id) {
            this.http.get(`${environment.apiUrl}/applications/check_accepted_status.php?student_id=${response.student_id}`).subscribe({
              next: (result: any) => {
                this.hasAcceptedInternship = result.hasAcceptedInternship;
              }
            });
          }
        }
      });
    }
  }

  loadInternshipDetails(id: string) {
    this.internshipService.getInternshipDetails(id)
      .subscribe({
        next: (response: any) => {
          this.internship = response;
          this.loading = false;
        },
        error: (error) => {
          this.error = 'Failed to load internship details';
          this.loading = false;
        }
      });
  }

  applyNow() {
    const loggedIn = localStorage.getItem('user');
    if (loggedIn) {
      this.router.navigate(['/apply', this.internship.id]);
    } else {
      this.router.navigate(['/login'], { queryParams: { redirect: `/apply/${this.internship.id}` } });
    }
  }

  isDeadlinePassed(): boolean {
    if (!this.internship?.deadline) return false;
    const today = new Date().toISOString().split('T')[0];
    return this.internship.deadline < today;
  }

  goBack() {
    window.history.back();
  }
}