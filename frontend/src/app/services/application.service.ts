import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

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
    private baseUrl = `${environment.apiUrl}/backend`;

    constructor(private http: HttpClient) { }

    apply(formData: FormData) {
        return this.http.post(`${this.baseUrl}/applications/add_application.php`, formData);
    }

    getApplications(): Observable<Application[]> {
        return this.http.get<Application[]>(`${this.baseUrl}/applications/get_applications.php`);
    }

    updateApplication(application: Application): Observable<any> {
        return this.http.put<any>(`${this.baseUrl}/applications/update_application.php`, application);
    }
}
