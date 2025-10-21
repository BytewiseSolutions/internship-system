import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from '../../environments/environment';

export interface Company {
    id?: number;
    name: string;
    email: string;
    industry: string;
    createdAt: Date;
    status: string;
    user?: {
        name: string;
        email: string;
        contact?: string;
        password?: string;
    };
}
export interface AddCompanyPayload {
    user: {
        name: string;
        email: string;
        contact?: string;
        password?: string;
    };
    company: {
        name: string;
        email: string;
        industry: string;
        status: string;
        createdAt: Date;
    };
}

@Injectable({ providedIn: 'root' })
export class CompanyService {
    private baseUrl = environment.apiUrl;
    private apiUrl = `${this.baseUrl}/company`;

    constructor(private http: HttpClient) { }

    getCompanies() {
        return this.http.get<Company[]>(`${this.apiUrl}/get_companies.php`);
    }
    addUser(user: any) {
        return this.http.post<{ id: number }>(`${this.baseUrl}/auth/register-company-user.php`, user);
    }

    addCompany(payload: AddCompanyPayload) {
        return this.http.post<Company>(`${this.apiUrl}/add_company.php`, payload);
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
