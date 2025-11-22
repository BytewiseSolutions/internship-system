import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { 
  IonContent, IonHeader, IonToolbar, IonTitle, IonCard, IonCardContent, 
  IonCardHeader, IonCardTitle, IonButton, IonIcon, IonGrid, IonRow, IonCol,
  IonButtons, IonSpinner, IonBadge
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { 
  briefcaseOutline, documentTextOutline, personOutline, searchOutline, 
  search, listOutline, businessOutline, refreshOutline, checkmarkCircleOutline,
  timeOutline, calendarOutline, bookOutline, paperPlaneOutline, createOutline,
  cloudOfflineOutline, wifiOutline, closeCircleOutline, notificationsOutline,
  chatbubblesOutline, syncOutline, alertCircleOutline
} from 'ionicons/icons';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ApplicationService } from '../../services/application.service';
import { InternshipService } from '../../services/internship.service';
import { LogbookService } from '../../services/logbook.service';
import { DashboardCardComponent } from '../../shared/components/dashboard-card/dashboard-card.component';
import { StatCardComponent } from '../../shared/components/stat-card/stat-card.component';
import { OfflineService } from '../../services/offline.service';
import { PushNotificationService } from '../../services/push-notification.service';
import { SyncService } from '../../services/sync.service';

interface ActivityItem {
  id: string;
  type: 'application' | 'interview' | 'logbook' | 'internship';
  text: string;
  timestamp: Date;
  icon: string;
}

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: true,
  imports: [
    CommonModule, IonContent, IonHeader, IonToolbar, IonTitle, IonCard, 
    IonCardContent, IonCardHeader, IonCardTitle, IonButton, IonIcon, 
    IonGrid, IonRow, IonCol, IonButtons, IonSpinner, IonBadge,
    DashboardCardComponent, StatCardComponent
  ]
})
export class HomePage implements OnInit {
  studentName: string = '';
  loading = true;
  isOnline = true;
  availableInternships = 0;
  unreadCount = 0;
  syncStatus: 'syncing' | 'synced' | 'error' | null = null;
  
  stats = {
    applications: 0,
    accepted: 0,
    pending: 0,
    rejected: 0,
    interviews: 0,
    logbookEntries: 0
  };

  previousStats = {
    applications: 0,
    accepted: 0,
    pending: 0,
    rejected: 0,
    interviews: 0,
    logbookEntries: 0
  };

  recentActivity: ActivityItem[] = [];

  constructor(
    private router: Router, 
    private authService: AuthService, 
    private applicationService: ApplicationService,
    private internshipService: InternshipService,
    private logbookService: LogbookService,
    private offlineService: OfflineService,
    private pushService: PushNotificationService,
    private syncService: SyncService
  ) {
    addIcons({ 
      briefcaseOutline, documentTextOutline, personOutline, searchOutline, 
      search, listOutline, businessOutline, refreshOutline, checkmarkCircleOutline,
      timeOutline, calendarOutline, bookOutline, paperPlaneOutline, createOutline,
      cloudOfflineOutline, wifiOutline, closeCircleOutline, notificationsOutline,
      chatbubblesOutline, syncOutline, alertCircleOutline
    });
  }

  ngOnInit() {
    const user = this.authService.getCurrentUser();
    this.studentName = user?.name || 'Student';
    
    this.initOfflineSupport();
    this.initPushNotifications();
    this.initSync();
    this.loadStats();
    this.loadRecentActivity();
  }

  async initOfflineSupport() {
    this.offlineService.getNetworkStatus().subscribe(isOnline => {
      this.isOnline = isOnline;
      if (!isOnline) {
        this.loadOfflineData();
      }
    });
  }

  async initPushNotifications() {
    try {
      await this.pushService.initPushNotifications();
    } catch (error) {
      console.warn('Push notifications not available:', error);
    }
  }

  async initSync() {
    try {
      this.syncService.syncStatus$.subscribe(status => {
        this.syncStatus = status;
      });
      await this.syncService.syncData();
    } catch (error) {
      console.warn('Sync not available:', error);
    }
  }

  getSyncColor(): string {
    switch (this.syncStatus) {
      case 'syncing': return 'warning';
      case 'synced': return 'success';
      case 'error': return 'danger';
      default: return 'medium';
    }
  }

  getSyncIcon(): string {
    switch (this.syncStatus) {
      case 'syncing': return 'sync-outline';
      case 'synced': return 'checkmark-circle-outline';
      case 'error': return 'alert-circle-outline';
      default: return 'sync-outline';
    }
  }

  getSyncText(): string {
    switch (this.syncStatus) {
      case 'syncing': return 'Syncing';
      case 'synced': return 'Synced';
      case 'error': return 'Sync Error';
      default: return 'Sync';
    }
  }

  async loadOfflineData() {
    const offlineStats = await this.offlineService.getOfflineData('stats');
    if (offlineStats) {
      this.stats = offlineStats;
    }
  }

  loadStats() {
    const user = this.authService.getCurrentUser();
    
    // Load previous stats for comparison
    const savedStats = localStorage.getItem('mobileStats');
    if (savedStats) {
      this.previousStats = JSON.parse(savedStats);
    }

    // Load available internships count
    this.loadAvailableInternships();
    // Load unread notifications count
    this.loadUnreadNotifications();

    if (user?.id) {
      this.applicationService.getStudentApplications(user.id).subscribe({
        next: (response) => {
          if (response.success && response.applications) {
            this.stats.applications = response.applications.length;
            this.stats.accepted = response.applications.filter((app: any) => app.status === 'ACCEPTED').length;
            this.stats.pending = response.applications.filter((app: any) => app.status === 'PENDING').length;
            this.stats.rejected = response.applications.filter((app: any) => app.status === 'REJECTED').length;
            this.stats.interviews = response.applications.filter((app: any) => app.interview_scheduled).length;
            
            // Save current stats for next comparison
            localStorage.setItem('mobileStats', JSON.stringify(this.stats));
            // Save for offline access
            this.offlineService.saveOfflineData('stats', this.stats);
          }
          this.loading = false;
        },
        error: (error) => {
          console.error('Error loading stats:', error);
          // Reset to zero if no data
          this.stats = {
            applications: 0,
            accepted: 0,
            pending: 0,
            rejected: 0,
            interviews: 0,
            logbookEntries: 0
          };
          this.loading = false;
        }
      });
    } else {
      this.loading = false;
    }
  }

  loadAvailableInternships() {
    this.internshipService.getAvailableInternships().subscribe({
      next: (response) => {
        if (response.success && response.internships) {
          this.availableInternships = response.internships.length;
        } else {
          this.availableInternships = 0;
        }
      },
      error: (error) => {
        console.error('Error loading internships:', error);
        this.availableInternships = 0;
      }
    });
  }

  loadRecentActivity() {
    const user = this.authService.getCurrentUser();
    if (!user?.id) {
      this.recentActivity = [];
      return;
    }

    this.applicationService.getStudentApplications(user.id).subscribe({
      next: (response) => {
        const activities: ActivityItem[] = [];
        
        if (response.success && response.applications) {
          response.applications.slice(-3).forEach((app: any) => {
            activities.push({
              id: `app-${app.id}`,
              type: 'application',
              text: `Applied to ${app.internship_title || 'Internship'}`,
              timestamp: new Date(app.created_at || Date.now()),
              icon: 'paper-plane-outline'
            });
          });
        }

        this.logbookService.getStudentLogbook(user.id).subscribe({
          next: (logResponse) => {
            if (logResponse.success && logResponse.entries) {
              logResponse.entries.slice(-2).forEach((entry: any) => {
                activities.push({
                  id: `log-${entry.id}`,
                  type: 'logbook',
                  text: `Updated logbook: ${entry.title || 'Entry'}`,
                  timestamp: new Date(entry.updated_at || entry.created_at || Date.now()),
                  icon: 'create-outline'
                });
              });
            }
            
            this.recentActivity = activities
              .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
              .slice(0, 5);
          },
          error: () => {
            this.recentActivity = activities;
          }
        });
      },
      error: () => {
        this.recentActivity = [];
      }
    });
  }

  getChangeText(statType: keyof typeof this.stats): string {
    const current = this.stats[statType];
    const previous = this.previousStats[statType];
    const change = current - previous;
    
    if (change === 0) return '';
    return `${Math.abs(change)} ${change > 0 ? 'new' : 'less'}`;
  }

  getChangeType(statType: keyof typeof this.stats): 'positive' | 'negative' | 'neutral' {
    const current = this.stats[statType];
    const previous = this.previousStats[statType];
    const change = current - previous;
    
    if (change > 0) return 'positive';
    if (change < 0) return 'negative';
    return 'neutral';
  }

  trackActivity(index: number, item: ActivityItem): string {
    return item.id;
  }

  refreshDashboard() {
    this.loading = true;
    this.loadStats();
    this.loadRecentActivity();
  }

  navigateToInternships() {
    this.router.navigate(['/tabs/internships']);
  }

  navigateToProfile() {
    this.router.navigate(['/tabs/profile']);
  }

  navigateToLogbook() {
    this.router.navigate(['/tabs/logbook']);
  }

  navigateToMyInternship() {
    this.router.navigate(['/my-internship']);
  }

  navigateToApplications(status?: string) {
    this.router.navigate(['/tabs/applications'], { queryParams: status ? { status } : {} });
  }

  navigateToNotifications() {
    this.router.navigate(['/notifications']);
  }

  navigateToMessages() {
    this.router.navigate(['/messages']);
  }

  loadUnreadNotifications() {
    const user = this.authService.getCurrentUser();
    if (!user?.id) {
      this.unreadCount = 0;
      return;
    }

    // TODO: Replace with actual notification service when available
    // For now, check if there are any recent application status changes
    this.applicationService.getStudentApplications(user.id).subscribe({
      next: (response) => {
        if (response.success && response.applications) {
          // Count applications with recent status changes as notifications
          const recentChanges = response.applications.filter((app: any) => {
            const updatedAt = new Date(app.updated_at || app.created_at);
            const dayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
            return updatedAt > dayAgo && app.status !== 'PENDING';
          });
          this.unreadCount = recentChanges.length;
        } else {
          this.unreadCount = 0;
        }
      },
      error: () => {
        this.unreadCount = 0;
      }
    });
  }
}