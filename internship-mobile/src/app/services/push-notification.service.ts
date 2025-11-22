import { Injectable } from '@angular/core';
import { PushNotifications, Token, PushNotificationSchema, ActionPerformed } from '@capacitor/push-notifications';
import { LocalNotifications } from '@capacitor/local-notifications';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PushNotificationService {
  private notificationPermission$ = new BehaviorSubject<boolean>(false);

  async initPushNotifications() {
    // Request permission
    let permStatus = await PushNotifications.checkPermissions();
    
    if (permStatus.receive === 'prompt') {
      permStatus = await PushNotifications.requestPermissions();
    }
    
    if (permStatus.receive !== 'granted') {
      throw new Error('User denied permissions!');
    }

    this.notificationPermission$.next(true);
    await PushNotifications.register();

    // Listeners
    PushNotifications.addListener('registration', (token: Token) => {
      console.log('Push registration success, token: ' + token.value);
      this.saveTokenToServer(token.value);
    });

    PushNotifications.addListener('registrationError', (error: any) => {
      console.error('Error on registration: ' + JSON.stringify(error));
    });

    PushNotifications.addListener('pushNotificationReceived', (notification: PushNotificationSchema) => {
      console.log('Push received: ' + JSON.stringify(notification));
      this.showLocalNotification(notification);
    });

    PushNotifications.addListener('pushNotificationActionPerformed', (notification: ActionPerformed) => {
      console.log('Push action performed: ' + JSON.stringify(notification));
      this.handleNotificationAction(notification);
    });
  }

  async showLocalNotification(notification: any) {
    await LocalNotifications.schedule({
      notifications: [{
        title: notification.title || 'Internship Update',
        body: notification.body || 'You have a new update',
        id: Date.now(),
        schedule: { at: new Date(Date.now() + 1000) }
      }]
    });
  }

  private async saveTokenToServer(token: string) {
    // Save FCM token to backend
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (user.id) {
      try {
        // API call to save token
        console.log('Saving token for user:', user.id, token);
      } catch (error) {
        console.error('Failed to save token:', error);
      }
    }
  }

  private handleNotificationAction(notification: ActionPerformed) {
    // Handle notification tap/action
    const data = notification.notification.data;
    if (data?.route) {
      // Navigate to specific route
      console.log('Navigate to:', data.route);
    }
  }
}