import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private apiUrl = 'http://localhost:8000';

  constructor(private http: HttpClient) {}

  getSchools(): Observable<any> {
    return this.http.get(`${this.apiUrl}/api/schools/get_schools.php`);
  }

  getCourses(schoolId: number): Observable<any> {
    if (!schoolId) {
      throw new Error('School ID is required');
    }
    return this.http.get(`${this.apiUrl}/api/courses/get_courses.php?school_id=${schoolId}`);
  }
}