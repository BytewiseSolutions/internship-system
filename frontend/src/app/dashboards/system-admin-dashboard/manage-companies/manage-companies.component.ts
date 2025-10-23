import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-system-manage-companies',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './manage-companies.component.html',
  styleUrls: ['./manage-companies.component.scss']
})
export class SystemManageCompaniesComponent implements OnInit {
  companies: any[] = [];
  loading = true;

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.loadCompanies();
  }

  loadCompanies() {
    this.http.get(`${environment.apiUrl}/company/get_companies.php`)
      .subscribe({
        next: (data: any) => {
          this.companies = data;
          this.loading = false;
        },
        error: (error) => {
          console.error('Error loading companies:', error);
          this.loading = false;
        }
      });
  }
}