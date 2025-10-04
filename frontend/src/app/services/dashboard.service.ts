import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class DashboardService {
    private apiUrl = `${environment.apiUrl}/backend/company`;

    constructor(private http: HttpClient) { }

    getCompanyStats(companyId: number): Observable<any> {
        return this.http.get<any>(`${this.apiUrl}/company_stats.php?company_id=${companyId}`);
    }
    getRecentInternships(companyId: number) {
        return this.http.get<any[]>(`${this.apiUrl}/recent_internships.php?company_id=${companyId}`);
    }
    getRecentApplications(companyId: number) {
        return this.http.get<any[]>(`${this.apiUrl}/recent_applications.php?company_id=${companyId}`);
    }
}
