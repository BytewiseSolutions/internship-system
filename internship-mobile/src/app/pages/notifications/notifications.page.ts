import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonContent, IonHeader, IonToolbar, IonTitle, IonCard, IonCardContent, IonIcon, IonBadge } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { notificationsOutline, checkmarkCircleOutline, timeOutline } from 'ionicons/icons';
import { AuthService } from '../../services/auth.service';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.page.html',
  styleUrls: ['./notifications.page.scss'],
  standalone: true,
  imports: [CommonModule, IonContent, IonHeader, IonToolbar, IonTitle, IonCard, IonCardContent, IonIcon, IonBadge]
})
export class NotificationsPage implements OnInit {
  notifications: any[] = [];
  isLoading = true;

  constructor(
    private authService: AuthService,
    private notificationService: NotificationService
  ) {
    addIcons({ notificationsOutline, checkmarkCircleOutline, timeOutline });
  }

  ngOnInit() {
    this.loadNotifications();
  }

  loadNotifications() {
    const user = this.authService.getCurrentUser();
    if (user?.id) {
      this.notificationService.getUserNotifications(user.id).subscribe({
        next: (response) => {
          this.notifications = response.success ? response.notifications : [];
          
          // Update unread count
          const unreadCount = this.notifications.filter(n => !n.is_read).length;
          this.notificationService.updateUnreadCount(unreadCount);
          
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error loading notifications:', error);
          this.notifications = [];
          this.isLoading = false;
        }
      });
    } else {
      this.isLoading = false;
    }
  }

  markAsRead(notification: any) {
    if (!notification.is_read) {
      this.notificationService.markAsRead(notification.notification_id).subscribe({
        next: (response) => {
          if (response.success) {
            notification.is_read = true;
            this.notificationService.decrementUnreadCount();
          }
        },
        error: (error) => {
          console.error('Error marking notification as read:', error);
        }
      });
    }
  }
}