import { Injectable } from '@angular/core';
import { Preferences } from '@capacitor/preferences';
import { Network } from '@capacitor/network';
import { BehaviorSubject, Observable } from 'rxjs';

export interface OfflineData {
  internships: any[];
  applications: any[];
  profile: any;
  lastSync: string;
}

@Injectable({
  providedIn: 'root'
})
export class OfflineService {
  private isOnline$ = new BehaviorSubject<boolean>(true);
  private syncQueue: any[] = [];

  constructor() {
    this.initNetworkListener();
  }

  async initNetworkListener() {
    const status = await Network.getStatus();
    this.isOnline$.next(status.connected);

    Network.addListener('networkStatusChange', status => {
      this.isOnline$.next(status.connected);
      if (status.connected) {
        this.syncOfflineData();
      }
    });
  }

  getNetworkStatus(): Observable<boolean> {
    return this.isOnline$.asObservable();
  }

  async saveOfflineData(key: string, data: any): Promise<void> {
    await Preferences.set({
      key: `offline_${key}`,
      value: JSON.stringify(data)
    });
  }

  async getOfflineData(key: string): Promise<any> {
    const result = await Preferences.get({ key: `offline_${key}` });
    return result.value ? JSON.parse(result.value) : null;
  }

  async addToSyncQueue(action: any): Promise<void> {
    this.syncQueue.push(action);
    await Preferences.set({
      key: 'sync_queue',
      value: JSON.stringify(this.syncQueue)
    });
  }

  async syncOfflineData(): Promise<void> {
    const queueData = await Preferences.get({ key: 'sync_queue' });
    if (queueData.value) {
      const queue = JSON.parse(queueData.value);
      // Process sync queue
      for (const action of queue) {
        try {
          await this.processAction(action);
        } catch (error) {
          console.error('Sync error:', error);
        }
      }
      // Clear queue after sync
      await Preferences.remove({ key: 'sync_queue' });
      this.syncQueue = [];
    }
  }

  private async processAction(action: any): Promise<void> {
    // Process different action types
    switch (action.type) {
      case 'application':
        // Sync application data
        break;
      case 'profile':
        // Sync profile updates
        break;
    }
  }
}