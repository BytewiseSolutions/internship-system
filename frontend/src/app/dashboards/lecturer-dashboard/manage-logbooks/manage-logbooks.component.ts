import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LogbookService } from '../../../services/logbook.service';

@Component({
  selector: 'app-manage-logbooks',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './manage-logbooks.component.html',
  styleUrls: ['./manage-logbooks.component.scss']
})
export class ManageLogbooksComponent implements OnInit {
  logbooks: any[] = [];
  loading = true;

  constructor(private logbookService: LogbookService) {}

  ngOnInit() {
    this.loadLogbooks();
  }

  loadLogbooks() {
    this.logbookService.getAllLogbooks()
      .subscribe({
        next: (data: any) => {
          this.logbooks = data;
          this.loading = false;
        },
        error: (error) => {
          console.error('Error loading logbooks:', error);
          this.loading = false;
        }
      });
  }
}