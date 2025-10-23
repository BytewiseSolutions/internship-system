import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss']
})
export class ReportsComponent {
  reportTypes = [
    { title: 'Logbook', icon: 'fas fa-book', description: 'View and download student logbook reports' },
    { title: 'Feedback', icon: 'fas fa-comment', description: 'Generate feedback reports for students' }
  ];
}