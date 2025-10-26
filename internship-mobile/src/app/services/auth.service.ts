import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:8000';
  private currentUserSubject = new BehaviorSubject<any>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient) {
    this.loadStoredUser();
  }

  login(email: string, password: string): Observable<any> {
    const loginData = {
      email: email,
      password: password
    };

    return this.http.post(`${this.apiUrl}/login.php`, loginData).pipe(
      tap((response: any) => {
        if (response.message === 'Login successful') {
          this.setCurrentUser(response);
        }
      })
    );
  }

  register(userData: any): Observable<any> {
    const registerData = {
      name: userData.name,
      email: userData.email,
      password: userData.password,
      school_id: userData.school_id,
      course_id: userData.course_id
    };

    return this.http.post(`${this.apiUrl}/register.php`, registerData);
  }

  logout() {
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
  }

  private setCurrentUser(user: any) {
    localStorage.setItem('currentUser', JSON.stringify(user));
    this.currentUserSubject.next(user);
  }

  private loadStoredUser() {
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      this.currentUserSubject.next(JSON.parse(storedUser));
    }
  }

  isLoggedIn(): boolean {
    return this.currentUserSubject.value !== null;
  }

  getCurrentUser() {
    return this.currentUserSubject.value;
  }

  updateProfile(userData: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/update_profile.php`, userData).pipe(
      tap((response: any) => {
        if (response.success) {
          const currentUser = this.getCurrentUser();
          if (currentUser) {
            currentUser.name = userData.name;
            currentUser.email = userData.email;
            this.setCurrentUser(currentUser);
          }
        }
      })
    );
  }
}