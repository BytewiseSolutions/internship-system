import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class InternshipService {
  private apiUrl = 'http://127.0.0.1:8001';

  constructor(private http: HttpClient) {}

  getAvailableInternships(): Observable<any> {
    return this.http.get(`${this.apiUrl}/internships/get_available_internships.php`);
  }
}