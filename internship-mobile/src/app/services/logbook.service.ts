import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LogbookService {
  private apiUrl = 'http://localhost:8000';

  constructor(private http: HttpClient) {}

  addLogbookEntry(entryData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/logbook/add_logbook_entry.php`, entryData);
  }

  getStudentLogbook(userId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/logbook/get_student_logbook.php?user_id=${userId}`);
  }

  updateLogbookEntry(entryData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/logbook/update_logbook_entry.php`, entryData);
  }
}