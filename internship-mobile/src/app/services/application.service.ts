import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApplicationService {
  private apiUrl = 'http://127.0.0.1:8001';

  constructor(private http: HttpClient) {}

  submitApplication(formData: FormData): Observable<any> {
    return this.http.post(`${this.apiUrl}/applications/add_application.php`, formData);
  }

  getStudentApplications(userId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/applications/get_student_applications.php?user_id=${userId}`);
  }
}