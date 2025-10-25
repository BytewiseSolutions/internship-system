import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { StudentHeaderComponent } from '../../../components/student/student-header/student-header.component';
import { StudentSidebarComponent } from '../../../components/student/student-sidebar/student-sidebar.component';

interface LogbookEntry {
  logbook_id: number;
  week_number: number;
  week_ending: string;
  activities_completed: string;
  skills_learned: string;
  challenges_faced: string;
  supervisor_feedback: string;
  created_at: string;
}

@Component({
  selector: 'app-logbook',
  standalone: true,
  imports: [CommonModule, FormsModule, StudentHeaderComponent, StudentSidebarComponent],
  templateUrl: './logbook.component.html',
  styleUrls: ['./logbook.component.scss']
})
export class LogbookComponent implements OnInit {
  isSidebarCollapsed = false;
  entries: LogbookEntry[] = [];
  loading = true;
  error = '';
  internshipInfo: any = null;
  showAddForm = false;
  editingEntry: LogbookEntry | null = null;
  
  newEntry = {
    week_number: 1,
    week_ending: '',
    activities_completed: '',
    skills_learned: '',
    challenges_faced: ''
  };

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.loadEntries();
  }

  onSidebarCollapseChanged(collapsed: boolean) {
    this.isSidebarCollapsed = collapsed;
  }

  loadEntries() {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const userId = user.id;
    if (!userId) {
      this.error = 'User not found';
      this.loading = false;
      return;
    }

    this.http.get<any>(`${environment.apiUrl}/logbook/get_student_logbook.php?user_id=${userId}`)
      .subscribe({
        next: (response) => {
          if (response.success) {
            this.entries = response.entries;
            this.internshipInfo = response.internship;
            if (response.message && !this.internshipInfo) {
              this.error = response.message;
            }
          } else {
            this.error = response.message;
          }
          this.loading = false;
        },
        error: (err) => {
          this.error = 'Failed to load logbook entries';
          this.loading = false;
        }
      });
  }

  addEntry() {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const userId = user.id;
    if (!userId) {
      this.error = 'User not found';
      return;
    }

    const payload = {
      user_id: userId,
      ...this.newEntry
    };

    this.http.post<any>(`${environment.apiUrl}/logbook/add_logbook_entry.php`, payload)
      .subscribe({
        next: (response) => {
          if (response.success) {
            this.showAddForm = false;
            this.resetForm();
            this.loadEntries();
          } else {
            this.error = response.message;
          }
        },
        error: (err) => {
          this.error = 'Failed to add logbook entry';
        }
      });
  }

  resetForm() {
    this.newEntry = {
      week_number: this.entries.length + 1,
      week_ending: '',
      activities_completed: '',
      skills_learned: '',
      challenges_faced: ''
    };
  }

  editEntry(entry: LogbookEntry) {
    this.editingEntry = entry;
    this.newEntry = {
      week_number: entry.week_number,
      week_ending: entry.week_ending,
      activities_completed: entry.activities_completed,
      skills_learned: entry.skills_learned,
      challenges_faced: entry.challenges_faced
    };
    this.showAddForm = true;
  }

  updateEntry() {
    if (!this.editingEntry) return;
    
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const userId = user.id;
    if (!userId) {
      this.error = 'User not found';
      return;
    }

    const payload = {
      logbook_id: this.editingEntry.logbook_id,
      user_id: userId,
      week_ending: this.newEntry.week_ending,
      activities_completed: this.newEntry.activities_completed,
      skills_learned: this.newEntry.skills_learned,
      challenges_faced: this.newEntry.challenges_faced
    };

    this.http.put<any>(`${environment.apiUrl}/logbook/update_logbook_entry.php`, payload)
      .subscribe({
        next: (response) => {
          if (response.success) {
            this.showAddForm = false;
            this.editingEntry = null;
            this.resetForm();
            this.loadEntries();
          } else {
            this.error = response.message;
          }
        },
        error: (err) => {
          this.error = 'Failed to update logbook entry';
        }
      });
  }

  cancelEdit() {
    this.showAddForm = false;
    this.editingEntry = null;
    this.resetForm();
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString();
  }
}