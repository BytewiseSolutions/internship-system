import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-manage-schools',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './manage-schools.component.html',
  styleUrls: ['./manage-schools.component.scss']
})
export class ManageSchoolsComponent implements OnInit {
  schools: any[] = [];
  loading = true;

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.loadSchools();
  }

  loadSchools() {
    this.http.get(`${environment.apiUrl}/api/schools/get_schools.php`)
      .subscribe({
        next: (data: any) => {
          this.schools = data;
          this.loading = false;
        },
        error: (error) => {
          console.error('Error loading schools:', error);
          this.loading = false;
        }
      });
  }
}