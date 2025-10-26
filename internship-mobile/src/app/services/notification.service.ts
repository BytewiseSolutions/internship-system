import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private apiUrl = 'http://localhost:8000';
  private unreadCountSubject = new BehaviorSubject<number>(0);
  public unreadCount$ = this.unreadCountSubject.asObservable();

  constructor(private http: HttpClient) {}

  getUserNotifications(userId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/notifications/get_user_notifications.php?user_id=${userId}`);
  }

  markAsRead(notificationId: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/notifications/mark_as_read.php`, {
      notification_id: notificationId
    });
  }

  getUnreadCount(): number {
    return this.unreadCountSubject.value;
  }

  updateUnreadCount(count: number) {
    this.unreadCountSubject.next(count);
  }

  decrementUnreadCount() {
    const current = this.unreadCountSubject.value;
    if (current > 0) {
      this.unreadCountSubject.next(current - 1);
    }
  }
}