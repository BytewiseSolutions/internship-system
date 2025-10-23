import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LogbookService } from '../../../services/logbook.service';

@Component({
  selector: 'app-logbook',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './logbook.component.html',
  styleUrls: ['./logbook.component.scss']
})
export class LogbookComponent implements OnInit {
  logbookForm = {
    week_number: 1,
    week_ending: '',
    activities_completed: '',
    skills_learned: '',
    challenges_faced: ''
  };
  
  myLogbooks: any[] = [];
  loading = false;
  submitting = false;

  constructor(private logbookService: LogbookService) {}

  ngOnInit() {
    this.loadMyLogbooks();
  }

  loadMyLogbooks() {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    this.loading = true;
    
    this.logbookService.getStudentLogbooks(user.id)
      .subscribe({
        next: (data: any) => {
          this.myLogbooks = data;
          this.loading = false;
        },
        error: (error) => {
          console.error('Error loading logbooks:', error);
          this.loading = false;
        }
      });
  }

  submitLogbook() {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    this.submitting = true;

    const logbookData = {
      ...this.logbookForm,
      student_id: user.id
    };

    this.logbookService.addLogbook(logbookData)
      .subscribe({
        next: (response: any) => {
          if (response.success) {
            alert('Logbook entry submitted successfully!');
            this.resetForm();
            this.loadMyLogbooks();
          }
          this.submitting = false;
        },
        error: (error) => {
          console.error('Error submitting logbook:', error);
          alert('Error submitting logbook entry');
          this.submitting = false;
        }
      });
  }

  resetForm() {
    this.logbookForm = {
      week_number: this.logbookForm.week_number + 1,
      week_ending: '',
      activities_completed: '',
      skills_learned: '',
      challenges_faced: ''
    };
  }
}