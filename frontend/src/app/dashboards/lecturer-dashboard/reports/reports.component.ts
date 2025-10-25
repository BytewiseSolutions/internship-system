import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss']
})
export class ReportsComponent {
  reportTypes = [
    { title: 'Logbook', icon: 'fas fa-book', description: 'View and download student logbook reports', type: 'logbook' },
    { title: 'Feedback', icon: 'fas fa-comment', description: 'Generate feedback reports for students', type: 'feedback' }
  ];
  
  reportData: any[] = [];
  currentReportType = '';
  showReportModal = false;

  constructor(private http: HttpClient) {}

  generateReport(reportType: string) {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const apiUrl = reportType === 'logbook' 
      ? `${environment.apiUrl}/api/lecturer/get_logbook_report.php?user_id=${user.id}`
      : `${environment.apiUrl}/api/lecturer/get_feedback_report.php?user_id=${user.id}`;

    this.http.get(apiUrl).subscribe({
      next: (data: any) => {
        this.reportData = data;
        this.currentReportType = reportType;
        this.showReportModal = true;
      },
      error: (error) => {
        console.error('Error generating report:', error);
        alert('Error generating report. Please try again.');
      }
    });
  }

  closeModal() {
    this.showReportModal = false;
  }

  downloadCurrentReport() {
    this.downloadReport(this.reportData, this.currentReportType);
  }

  downloadReport(data: any[], reportType: string) {
    const csvContent = this.convertToCSV(data, reportType);
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${reportType}_report_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    window.URL.revokeObjectURL(url);
  }

  convertToCSV(data: any[], reportType: string): string {
    if (data.length === 0) return 'No data available';

    if (reportType === 'logbook') {
      const headers = ['Student Name', 'Student ID', 'Course', 'Week', 'Activities', 'Skills Learned', 'Challenges', 'Date'];
      const rows = data.map(item => [
        item.student_name,
        item.student_id,
        item.course_name,
        item.week_number,
        item.activities,
        item.skills_learned,
        item.challenges,
        new Date(item.created_at).toLocaleDateString()
      ]);
      return [headers, ...rows].map(row => row.map(field => `"${field}"`).join(',')).join('\n');
    } else {
      const headers = ['Student Name', 'Student ID', 'Course', 'Company', 'Rating', 'Review', 'Status', 'Date'];
      const rows = data.map(item => [
        item.student_name,
        item.student_id,
        item.course_name,
        item.company_name || 'Not assigned',
        item.rating || 'No rating',
        item.review_text || 'No review',
        item.application_status || 'No application',
        item.created_at ? new Date(item.created_at).toLocaleDateString() : 'N/A'
      ]);
      return [headers, ...rows].map(row => row.map(field => `"${field}"`).join(',')).join('\n');
    }
  }
}