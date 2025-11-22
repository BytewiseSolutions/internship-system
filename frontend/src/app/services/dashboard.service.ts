import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';

export interface StudentStats {
  applications: number;
  accepted: number;
  pending: number;
  rejected: number;
  interviews: number;
  internships: number;
  logbookEntries: number;
}

export interface ActivityItem {
  type: 'application' | 'interview' | 'logbook' | 'internship';
  text: string;
  timestamp: string;
  icon: string;
}

export interface DashboardData {
  stats: StudentStats;
  recentActivity: ActivityItem[];
  lastUpdated: Date;
}

@Injectable({ providedIn: 'root' })
export class DashboardService {
    private apiUrl = environment.apiUrl;
    private dashboardData$ = new BehaviorSubject<DashboardData | null>(null);
    private refreshInterval: any;

    constructor(private http: HttpClient) {
        // Auto-refresh dashboard data every 5 minutes
        this.startAutoRefresh();
    }

    getDashboardData(): Observable<DashboardData | null> {
        return this.dashboardData$.asObservable();
    }

    getStudentStats(studentId: number): Observable<DashboardData> {
        return this.http.get<any>(`${this.apiUrl}/api/student/get_student_stats.php?student_id=${studentId}`)
            .pipe(
                map(response => {
                    if (response.success) {
                        const dashboardData: DashboardData = {
                            stats: {
                                applications: response.applications || 0,
                                accepted: response.accepted || 0,
                                pending: response.pending || 0,
                                rejected: response.rejected || 0,
                                interviews: response.interviews || 0,
                                internships: response.internships || 0,
                                logbookEntries: response.logbookEntries || 0
                            },
                            recentActivity: response.recentActivity || [],
                            lastUpdated: new Date()
                        };
                        
                        // Update the behavior subject
                        this.dashboardData$.next(dashboardData);
                        
                        // Cache the data
                        this.cacheDashboardData(dashboardData);
                        
                        return dashboardData;
                    }
                    throw new Error(response.message || 'Failed to load dashboard data');
                }),
                catchError(error => {
                    console.error('Dashboard service error:', error);
                    // Return cached data if available
                    const cachedData = this.getCachedDashboardData();
                    if (cachedData) {
                        this.dashboardData$.next(cachedData);
                        return [cachedData];
                    }
                    throw error;
                })
            );
    }

    getCompanyStats(companyId: number): Observable<any> {
        return this.http.get<any>(`${this.apiUrl}/company/company_stats.php?company_id=${companyId}`);
    }
    
    getRecentInternships(companyId: number) {
        return this.http.get<any[]>(`${this.apiUrl}/company/recent_internships.php?company_id=${companyId}`);
    }
    
    getRecentApplications(companyId: number) {
        return this.http.get<any[]>(`${this.apiUrl}/company/recent_applications.php?company_id=${companyId}`);
    }

    refreshDashboard(studentId: number): Observable<DashboardData> {
        return this.getStudentStats(studentId);
    }

    private startAutoRefresh(): void {
        // Refresh every 5 minutes
        this.refreshInterval = setInterval(() => {
            const user = JSON.parse(localStorage.getItem('user') || '{}');
            if (user.id && user.user_type === 'student') {
                this.getStudentStats(user.id).subscribe({
                    error: (error) => console.warn('Auto-refresh failed:', error)
                });
            }
        }, 5 * 60 * 1000);
    }

    private cacheDashboardData(data: DashboardData): void {
        try {
            localStorage.setItem('dashboardCache', JSON.stringify({
                ...data,
                lastUpdated: data.lastUpdated.toISOString()
            }));
        } catch (error) {
            console.warn('Failed to cache dashboard data:', error);
        }
    }

    private getCachedDashboardData(): DashboardData | null {
        try {
            const cached = localStorage.getItem('dashboardCache');
            if (cached) {
                const data = JSON.parse(cached);
                return {
                    ...data,
                    lastUpdated: new Date(data.lastUpdated)
                };
            }
        } catch (error) {
            console.warn('Failed to load cached dashboard data:', error);
        }
        return null;
    }

    ngOnDestroy(): void {
        if (this.refreshInterval) {
            clearInterval(this.refreshInterval);
        }
    }
}
