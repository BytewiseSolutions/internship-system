import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';

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

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadInternshipDetails(id);
    }
  }

  loadInternshipDetails(id: string) {
    this.http.get(`http://localhost:8000/internships/get_internship_details.php?id=${id}`)
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

  goBack() {
    window.history.back();
  }
}