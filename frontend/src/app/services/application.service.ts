import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Application {
    id?: number;
    student_id: number;
    internship_id: number;
    status?: string;
    cvPath?: string;
    transcriptPath?: string;
    applicationLetterPath?: string;
}

@Injectable({
    providedIn: 'root'
})
export class ApplicationService {
    private apiUrl = 'http://localhost:8081/applications';

    constructor(private http: HttpClient) { }

    apply(application: Application): Observable<any> {
        return this.http.post<any>(`${this.apiUrl}/add_application.php`, application);
    }

    getApplications(): Observable<Application[]> {
        return this.http.get<Application[]>(`${this.apiUrl}/get_applications.php`);
    }

    updateApplication(application: Application): Observable<any> {
        return this.http.put<any>(`${this.apiUrl}/update_application.php`, application);
    }
}
