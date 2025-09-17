import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface User {
    id: number;
    name: string;
    email: string;
    role: 'STUDENT' | 'COMPANY' | 'ADMIN';
    status: 'PENDING' | 'ACTIVE' | 'SUSPENDED' | 'REJECTED';
}

@Injectable({
    providedIn: 'root',
})
export class UserService {
    private apiUrl = 'http://localhost:8081';

    constructor(private http: HttpClient) { }

    getPendingUsers(): Observable<User[]> {
        return this.http.get<User[]>(`${this.apiUrl}/auth/pending-users.php`);
    }
    getAllUsers(token: string): Observable<User[]> {
        return this.http.get<User[]>(`${this.apiUrl}/auth/all_users.php`, {
            headers: { Authorization: `Bearer ${token}` }
        });
    }
    approveUser(id: number): Observable<any> {
        return this.http.put(`${this.apiUrl}/auth/approve.php?id=${id}`, null, { responseType: 'text' });
    }

    rejectUser(id: number): Observable<any> {
        return this.http.put(`${this.apiUrl}/auth/reject.php?id=${id}`, null, { responseType: 'text' });
    }

    suspendUser(id: number): Observable<any> {
        return this.http.put(`${this.apiUrl}/auth/suspend.php?id=${id}`, null, { responseType: 'text' });
    }

    unsuspendUser(id: number): Observable<any> {
        return this.http.put(`${this.apiUrl}/auth/unsuspend.php?id=${id}`, null, { responseType: 'text' });
    }
}
