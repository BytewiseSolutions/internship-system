import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="dashboard-card" [class]="cardClass" [attr.aria-label]="ariaLabel">
      <div class="card-header" *ngIf="title || subtitle">
        <h3 class="card-title" *ngIf="title">{{ title }}</h3>
        <p class="card-subtitle" *ngIf="subtitle">{{ subtitle }}</p>
      </div>
      <div class="card-content">
        <ng-content></ng-content>
      </div>
      <div class="card-footer" *ngIf="hasFooter">
        <ng-content select="[slot=footer]"></ng-content>
      </div>
    </div>
  `,
  styles: [`
    .dashboard-card {
      background: var(--color-bg-primary);
      border: 1px solid var(--color-border);
      border-radius: var(--radius-lg);
      box-shadow: var(--shadow-sm);
      transition: var(--transition-base);
      overflow: hidden;
    }

    .dashboard-card:hover {
      box-shadow: var(--shadow-md);
      transform: translateY(-1px);
    }

    .card-header {
      padding: var(--spacing-4) var(--spacing-4) var(--spacing-2);
      border-bottom: 1px solid var(--color-border);
    }

    .card-title {
      font-size: 1.125rem;
      font-weight: 600;
      color: var(--color-text-primary);
      margin: 0;
    }

    .card-subtitle {
      font-size: 0.875rem;
      color: var(--color-text-secondary);
      margin: var(--spacing-1) 0 0;
    }

    .card-content {
      padding: var(--spacing-4);
    }

    .card-footer {
      padding: var(--spacing-2) var(--spacing-4) var(--spacing-4);
      border-top: 1px solid var(--color-border);
      background: var(--color-bg-secondary);
    }

    .card-elevated {
      box-shadow: var(--shadow-lg);
    }

    .card-compact .card-content {
      padding: var(--spacing-3);
    }

    .card-interactive {
      cursor: pointer;
    }

    .card-interactive:hover {
      border-color: var(--color-primary-500);
    }

    @media (max-width: 768px) {
      .card-content {
        padding: var(--spacing-3);
      }
    }
  `]
})
export class DashboardCardComponent {
  @Input() title?: string;
  @Input() subtitle?: string;
  @Input() cardClass?: string;
  @Input() ariaLabel?: string;
  @Input() hasFooter = false;
}