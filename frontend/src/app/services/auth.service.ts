import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AuthService {
    private baseUrl = environment.apiUrl;

    constructor(private http: HttpClient) { }

    register(student: any): Observable<any> {
        return this.http.post(`${this.baseUrl}/register.php`, student, { responseType: 'json' });
    }
    login(credentials: any): Observable<any> {
        return this.http.post(`${this.baseUrl}/login.php`, credentials).pipe(
            tap((response: any) => {
                console.log('Login response:', response);

                localStorage.setItem('token', response.token);
                localStorage.setItem('role', response.role);
                localStorage.setItem('email', response.email);

                localStorage.setItem('user', JSON.stringify(response));
            })
        );
    }
    notifyAdmin(role: string) {
        return this.http.post(
            `${this.baseUrl}/notify-admin?role=${role}`,
            {},
            { responseType: 'text' }
        );
    }


    forgotPassword(email: string): Observable<any> {
        return this.http.post(`${this.baseUrl}/forgot-password`, { email }, { responseType: 'json' });
    }
    resetPassword(token: string, newPassword: string) {
        return this.http.post(`${this.baseUrl}/reset-password`, { token, newPassword }, { responseType: 'json' });
    }
    logout() {
        localStorage.clear();
    }
    getToken(): string | null {
        return localStorage.getItem('token');
    }
    getRole(): string | null {
        return localStorage.getItem('role');
    }
    getCompanyId(): number {
        const userData = localStorage.getItem('user');
        if (!userData) {
            console.error('No user in storage');
            return 0;
        }

        const user = JSON.parse(userData);
        console.log('Company ID from storage:', user.companyId || user.company_id);
        return Number(user.companyId || user.company_id) || 0;
    }
}
