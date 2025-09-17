import { CompanyHeaderComponent } from './../../components/company/company-header/company-header.component';
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CompanySidebarComponent } from '../../components/company/company-sidebar/company-sidebar.component';

@Component({
  selector: 'app-company-layout',
  standalone: true,
  imports: [CompanyHeaderComponent, CompanySidebarComponent, RouterOutlet],
  templateUrl: './company-layout.component.html',
  styleUrl: './company-layout.component.scss'
})
export class CompanyLayoutComponent {
  isSidebarCollapsed = false;

  onSidebarCollapseChanged(collapsed: boolean) {
    this.isSidebarCollapsed = collapsed;
  }
}
