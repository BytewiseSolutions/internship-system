import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Internship {
    id?: number;
    title: string;
    company_id: number | null;
    company_name?: string;
    location: string;
    postedDate: string;
    deadline: string;
    description: string;
    status: string;
}
export interface AvailableInternship {
    id: number;
    title: string;
    name: string;
    location: string;
    postedDate: string;
    deadline: string;
    description: string;
    status: string;
}

export interface Company {
    id: number;
    name: string;
}

@Injectable({ providedIn: 'root' })
export class InternshipService {
    private apiUrl = 'http://localhost:8081/internships';

    constructor(private http: HttpClient) { }

    getInternships(): Observable<Internship[]> {
        return this.http.get<Internship[]>(`${this.apiUrl}/get_internships.php`);
    }
    getAvailableInternships(): Observable<AvailableInternship[]> {
        return this.http.get<AvailableInternship[]>(`${this.apiUrl}/get_available_internships.php`);
    }
    addInternship(internship: Internship): Observable<Internship> {
        return this.http.post<Internship>(`${this.apiUrl}/add_internship.php`, internship);
    }

    updateInternship(id: number, internship: Internship): Observable<Internship> {
        return this.http.put<Internship>(`${this.apiUrl}/update_internship.php?id=${id}`, internship);
    }

    deleteInternship(id: number): Observable<any> {
        return this.http.request('delete', `${this.apiUrl}/delete_internship.php?id=${id}`, {
            body: { confirm: true }
        });
    }
    getCompanies(): Observable<Company[]> {
        return this.http.get<Company[]>(`${this.apiUrl}/get_companies.php`);
    }
    apply(formData: FormData) {
        return this.http.post(`${this.apiUrl}/apply_internship.php`, formData);
    }

}
