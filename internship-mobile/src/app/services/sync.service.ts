import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, interval } from 'rxjs';
import { Preferences } from '@capacitor/preferences';
import { Network } from '@capacitor/network';

@Injectable({
  providedIn: 'root'
})
export class SyncService {
  private apiUrl = 'http://127.0.0.1:8001/sync';
  private syncStatus = new BehaviorSubject<'syncing' | 'synced' | 'error'>('synced');
  private lastSyncTime = new BehaviorSubject<string>('');
  
  public syncStatus$ = this.syncStatus.asObservable();
  public lastSyncTime$ = this.lastSyncTime.asObservable();

  constructor(private http: HttpClient) {
    this.initAutoSync();
  }

  async initAutoSync() {
    // Check network status
    const status = await Network.getStatus();
    if (status.connected) {
      this.startPeriodicSync();
    }

    // Listen for network changes
    Network.addListener('networkStatusChange', (status) => {
      if (status.connected) {
        this.syncData();
        this.startPeriodicSync();
      }
    });
  }

  private startPeriodicSync() {
    // Sync every 30 seconds when online
    interval(30000).subscribe(() => {
      this.syncData();
    });
  }

  async syncData(): Promise<void> {
    try {
      this.syncStatus.next('syncing');
      
      const lastSync = await this.getLastSyncTime();
      const userId = await this.getCurrentUserId();
      
      if (!userId) return;

      const response = await this.http.post(`${this.apiUrl}/sync_data.php`, {
        user_id: userId,
        last_sync: lastSync
      }).toPromise() as any;

      if (response.success) {
        await this.processSyncData(response.sync_data);
        await this.setLastSyncTime(response.sync_timestamp);
        this.lastSyncTime.next(response.sync_timestamp);
        this.syncStatus.next('synced');
      }
    } catch (error) {
      console.error('Sync failed:', error);
      this.syncStatus.next('error');
    }
  }

  private async processSyncData(syncData: any) {
    // Store synced data locally
    if (syncData.applications?.length > 0) {
      await Preferences.set({
        key: 'synced_applications',
        value: JSON.stringify(syncData.applications)
      });
    }

    if (syncData.messages?.length > 0) {
      await Preferences.set({
        key: 'synced_messages',
        value: JSON.stringify(syncData.messages)
      });
    }

    if (syncData.notifications?.length > 0) {
      await Preferences.set({
        key: 'synced_notifications',
        value: JSON.stringify(syncData.notifications)
      });
    }
  }

  private async getLastSyncTime(): Promise<string> {
    const result = await Preferences.get({ key: 'last_sync_time' });
    return result.value || '1970-01-01 00:00:00';
  }

  private async setLastSyncTime(timestamp: string): Promise<void> {
    await Preferences.set({
      key: 'last_sync_time',
      value: timestamp
    });
  }

  private async getCurrentUserId(): Promise<number | null> {
    const result = await Preferences.get({ key: 'current_user' });
    if (result.value) {
      const user = JSON.parse(result.value);
      return user.id;
    }
    return null;
  }

  async getSyncedData(type: 'applications' | 'messages' | 'notifications'): Promise<any[]> {
    const result = await Preferences.get({ key: `synced_${type}` });
    return result.value ? JSON.parse(result.value) : [];
  }

  async forcSync(): Promise<void> {
    await Preferences.set({
      key: 'last_sync_time',
      value: '1970-01-01 00:00:00'
    });
    await this.syncData();
  }
}