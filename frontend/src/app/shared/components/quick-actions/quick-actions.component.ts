import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

export interface QuickAction {
  id: string;
  label: string;
  icon: string;
  route?: string;
  action?: () => void;
  variant?: 'primary' | 'secondary' | 'outline';
  disabled?: boolean;
  ariaLabel?: string;
}

@Component({
  selector: 'app-quick-actions',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="quick-actions" [class]="layout">
      <h3 class="actions-title" *ngIf="title">{{ title }}</h3>
      <div class="actions-grid" [class]="gridClass">
        <button
          *ngFor="let action of actions"
          class="action-button"
          [class]="getButtonClass(action)"
          [routerLink]="action.route"
          [disabled]="action.disabled"
          [attr.aria-label]="action.ariaLabel || action.label"
          (click)="handleAction(action)"
        >
          <div class="action-icon">
            <i [class]="action.icon" [attr.aria-hidden]="true"></i>
          </div>
          <span class="action-label">{{ action.label }}</span>
        </button>
      </div>
    </div>
  `,
  styles: [`
    .quick-actions {
      background: var(--color-bg-primary);
      border-radius: var(--radius-lg);
      padding: var(--spacing-6);
    }

    .actions-title {
      font-size: 1.25rem;
      font-weight: 600;
      color: var(--color-text-primary);
      margin: 0 0 var(--spacing-4);
    }

    .actions-grid {
      display: grid;
      gap: var(--spacing-4);
    }

    .grid-2 {
      grid-template-columns: repeat(2, 1fr);
    }

    .grid-3 {
      grid-template-columns: repeat(3, 1fr);
    }

    .grid-4 {
      grid-template-columns: repeat(4, 1fr);
    }

    .action-button {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: var(--spacing-3);
      padding: var(--spacing-4);
      border: 1px solid var(--color-border);
      border-radius: var(--radius-lg);
      background: var(--color-bg-primary);
      color: var(--color-text-primary);
      text-decoration: none;
      transition: var(--transition-base);
      cursor: pointer;
      font-family: inherit;
      min-height: 100px;
    }

    .action-button:hover:not(:disabled) {
      background: var(--color-bg-secondary);
      border-color: var(--color-primary-500);
      transform: translateY(-2px);
      box-shadow: var(--shadow-md);
    }

    .action-button:focus {
      outline: 2px solid var(--color-primary-500);
      outline-offset: 2px;
    }

    .action-button:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .action-button.primary {
      background: var(--color-primary-500);
      color: white;
      border-color: var(--color-primary-500);
    }

    .action-button.primary:hover:not(:disabled) {
      background: var(--color-primary-800);
      border-color: var(--color-primary-800);
    }

    .action-button.secondary {
      background: var(--color-secondary-500);
      color: white;
      border-color: var(--color-secondary-500);
    }

    .action-button.secondary:hover:not(:disabled) {
      background: var(--color-secondary-700);
      border-color: var(--color-secondary-700);
    }

    .action-button.outline {
      background: transparent;
      border: 2px solid var(--color-primary-500);
      color: var(--color-primary-500);
    }

    .action-button.outline:hover:not(:disabled) {
      background: var(--color-primary-500);
      color: white;
    }

    .action-icon {
      font-size: 1.5rem;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .action-label {
      font-size: 0.875rem;
      font-weight: 500;
      text-align: center;
      line-height: 1.3;
    }

    .horizontal .actions-grid {
      grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
    }

    .horizontal .action-button {
      flex-direction: row;
      justify-content: flex-start;
      text-align: left;
      min-height: 60px;
    }

    .horizontal .action-icon {
      font-size: 1.25rem;
    }

    @media (max-width: 768px) {
      .actions-grid {
        grid-template-columns: repeat(2, 1fr);
        gap: var(--spacing-3);
      }

      .action-button {
        padding: var(--spacing-3);
        min-height: 80px;
      }

      .action-icon {
        font-size: 1.25rem;
      }

      .action-label {
        font-size: 0.75rem;
      }
    }

    @media (max-width: 480px) {
      .actions-grid {
        grid-template-columns: 1fr;
      }

      .horizontal .action-button {
        flex-direction: row;
        justify-content: flex-start;
      }
    }
  `]
})
export class QuickActionsComponent {
  @Input() title?: string;
  @Input() actions: QuickAction[] = [];
  @Input() layout: 'grid' | 'horizontal' = 'grid';
  @Input() columns: 2 | 3 | 4 = 4;

  get gridClass(): string {
    return `grid-${this.columns}`;
  }

  getButtonClass(action: QuickAction): string {
    return action.variant || 'outline';
  }

  handleAction(action: QuickAction): void {
    if (action.action && !action.disabled) {
      action.action();
    }
  }
}