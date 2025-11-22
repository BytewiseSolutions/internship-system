import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-stat-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="stat-card" [class]="variant" [attr.aria-label]="ariaLabel">
      <div class="stat-icon" [class]="iconColor" *ngIf="icon">
        <i [class]="icon" [attr.aria-hidden]="true"></i>
      </div>
      <div class="stat-content">
        <div class="stat-value" [class]="valueSize">{{ value }}</div>
        <div class="stat-label">{{ label }}</div>
        <div class="stat-change" *ngIf="change" [class]="changeType">
          <i [class]="changeIcon" [attr.aria-hidden]="true"></i>
          {{ change }}
        </div>
      </div>
    </div>
  `,
  styles: [`
    .stat-card {
      background: var(--color-bg-primary);
      border: 1px solid var(--color-border);
      border-radius: var(--radius-lg);
      padding: var(--spacing-6);
      display: flex;
      align-items: center;
      gap: var(--spacing-4);
      transition: var(--transition-base);
      box-shadow: var(--shadow-sm);
    }

    .stat-card:hover {
      box-shadow: var(--shadow-md);
      transform: translateY(-1px);
    }

    .stat-icon {
      width: 48px;
      height: 48px;
      border-radius: var(--radius-lg);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.5rem;
      flex-shrink: 0;
    }

    .stat-icon.primary {
      background: var(--color-primary-50);
      color: var(--color-primary-800);
    }

    .stat-icon.success {
      background: #e8f5e8;
      color: var(--color-success);
    }

    .stat-icon.warning {
      background: #fff3e0;
      color: var(--color-warning);
    }

    .stat-icon.info {
      background: #e3f2fd;
      color: var(--color-info);
    }

    .stat-content {
      flex: 1;
      min-width: 0;
    }

    .stat-value {
      font-size: 2rem;
      font-weight: 700;
      color: var(--color-text-primary);
      line-height: 1.2;
      margin-bottom: var(--spacing-1);
    }

    .stat-value.large {
      font-size: 2.5rem;
    }

    .stat-value.small {
      font-size: 1.5rem;
    }

    .stat-label {
      font-size: 0.875rem;
      color: var(--color-text-secondary);
      font-weight: 500;
      margin-bottom: var(--spacing-1);
    }

    .stat-change {
      font-size: 0.75rem;
      font-weight: 600;
      display: flex;
      align-items: center;
      gap: var(--spacing-1);
    }

    .stat-change.positive {
      color: var(--color-success);
    }

    .stat-change.negative {
      color: var(--color-error);
    }

    .stat-change.neutral {
      color: var(--color-text-tertiary);
    }

    .compact {
      padding: var(--spacing-4);
      gap: var(--spacing-3);
    }

    .compact .stat-icon {
      width: 40px;
      height: 40px;
      font-size: 1.25rem;
    }

    .compact .stat-value {
      font-size: 1.5rem;
    }

    @media (max-width: 768px) {
      .stat-card {
        padding: var(--spacing-4);
        gap: var(--spacing-3);
      }

      .stat-icon {
        width: 40px;
        height: 40px;
        font-size: 1.25rem;
      }

      .stat-value {
        font-size: 1.5rem;
      }
    }
  `]
})
export class StatCardComponent {
  @Input() value: string | number = '';
  @Input() label: string = '';
  @Input() icon?: string;
  @Input() iconColor: 'primary' | 'success' | 'warning' | 'info' = 'primary';
  @Input() variant?: string;
  @Input() valueSize: 'small' | 'normal' | 'large' = 'normal';
  @Input() change?: string;
  @Input() changeType: 'positive' | 'negative' | 'neutral' = 'neutral';
  @Input() ariaLabel?: string;

  get changeIcon(): string {
    switch (this.changeType) {
      case 'positive': return 'fas fa-arrow-up';
      case 'negative': return 'fas fa-arrow-down';
      default: return 'fas fa-minus';
    }
  }
}