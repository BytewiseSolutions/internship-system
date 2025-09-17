import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { StudentHeaderComponent } from '../../components/student/student-header/student-header.component';
import { StudentSidebarComponent } from '../../components/student/student-sidebar/student-sidebar.component';

@Component({
  selector: 'app-student-layout',
  imports: [RouterOutlet, StudentHeaderComponent, StudentSidebarComponent],
  templateUrl: './student-layout.component.html',
  styleUrl: './student-layout.component.scss'
})
export class StudentLayoutComponent {
  isSidebarCollapsed = false;

  onSidebarCollapseChanged(collapsed: boolean) {
    this.isSidebarCollapsed = collapsed;
  }
}
