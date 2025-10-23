import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LogbookService {
  private baseUrl = `${environment.apiUrl}/logbook`;

  constructor(private http: HttpClient) {}

  addLogbook(logbookData: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/add_logbook.php`, logbookData);
  }

  getStudentLogbooks(studentId: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/get_student_logbooks.php?student_id=${studentId}`);
  }

  getAllLogbooks(): Observable<any> {
    return this.http.get(`${this.baseUrl}/get_all_logbooks.php`);
  }
}