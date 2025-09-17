import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";

export interface Company {
    id?: number;
    name: string;
    email: string;
    industry: string;
    createdAt: Date;
    status: string;
}

@Injectable({ providedIn: 'root' })
export class CompanyService {
    private apiUrl = 'http://localhost:8081/company';

    constructor(private http: HttpClient) { }

    getCompanies() {
        return this.http.get<Company[]>(`${this.apiUrl}/get_companies.php`);
    }

    addCompany(company: Company) {
        return this.http.post<Company>(`${this.apiUrl}/add_company.php`, company);
    }

    updateCompany(id: number, company: Company) {
        return this.http.put<Company>(`${this.apiUrl}/update_company.php?id=${id}`, company);
    }

    deleteCompany(id: number) {
        return this.http.request('delete', `${this.apiUrl}/delete_company.php?id=${id}`, {
            body: { confirm: true }
        });
    }
    getCompany(id: number) {
        return this.http.get<Company>(`${this.apiUrl}/get-company.php?id=${id}`);
    }
    updateStatus(id: number, status: string) {
        return this.http.put<{ id: number; status: string; message: string }>(
            `${this.apiUrl}/update-company-status.php?id=${id}`,
            { status }
        );
    }
}
