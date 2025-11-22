import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonCard, IonCardContent, IonIcon, IonGrid, IonRow, IonCol } from '@ionic/angular/standalone';

@Component({
  selector: 'app-stat-card',
  standalone: true,
  imports: [CommonModule, IonCard, IonCardContent, IonIcon, IonGrid, IonRow, IonCol],
  template: `
    <ion-card class="stat-card" [class]="variant" [attr.aria-label]="ariaLabel">
      <ion-card-content>
        <ion-grid class="stat-grid">
          <ion-row class="ion-align-items-center">
            <ion-col size="auto" *ngIf="icon">
              <div class="stat-icon" [class]="iconColor">
                <ion-icon [name]="icon" [attr.aria-hidden]="true"></ion-icon>
              </div>
            </ion-col>
            <ion-col>
              <div class="stat-content">
                <div class="stat-value" [class]="valueSize">{{ value }}</div>
                <div class="stat-label">{{ label }}</div>
                <div class="stat-change" *ngIf="change" [class]="changeType">
                  <ion-icon [name]="changeIcon" [attr.aria-hidden]="true"></ion-icon>
                  {{ change }}
                </div>
              </div>
            </ion-col>
          </ion-row>
        </ion-grid>
      </ion-card-content>
    </ion-card>
  `,
  styles: [`
    .stat-card {
      margin: var(--ds-spacing-2);
      border-radius: var(--ds-radius-lg);
      box-shadow: var(--ds-shadow-sm);
      transition: var(--ds-transition-base);
    }

    .stat-card:hover {
      box-shadow: var(--ds-shadow-md);
      transform: translateY(-1px);
    }

    .stat-grid {
      padding: 0;
    }

    .stat-icon {
      width: 48px;
      height: 48px;
      border-radius: var(--ds-radius-lg);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.5rem;
    }

    .stat-icon.primary {
      background: var(--ds-color-primary-50);
      color: var(--ds-color-primary-800);
    }

    .stat-icon.success {
      background: var(--ds-color-success-light);
      color: var(--ds-color-success);
    }

    .stat-icon.warning {
      background: var(--ds-color-warning-light);
      color: var(--ds-color-warning);
    }

    .stat-icon.info {
      background: var(--ds-color-info-light);
      color: var(--ds-color-info);
    }

    .stat-content {
      padding-left: var(--ds-spacing-3);
    }

    .stat-value {
      font-size: 1.75rem;
      font-weight: var(--ds-font-weight-bold);
      color: var(--ds-color-text-primary);
      line-height: 1.2;
      margin-bottom: var(--ds-spacing-1);
    }

    .stat-value.large {
      font-size: 2rem;
    }

    .stat-value.small {
      font-size: 1.5rem;
    }

    .stat-label {
      font-size: var(--ds-font-size-sm);
      color: var(--ds-color-text-secondary);
      font-weight: var(--ds-font-weight-medium);
      margin-bottom: var(--ds-spacing-1);
    }

    .stat-change {
      font-size: var(--ds-font-size-xs);
      font-weight: var(--ds-font-weight-semibold);
      display: flex;
      align-items: center;
      gap: var(--ds-spacing-1);
    }

    .stat-change.positive {
      color: var(--ds-color-success);
    }

    .stat-change.negative {
      color: var(--ds-color-error);
    }

    .stat-change.neutral {
      color: var(--ds-color-text-tertiary);
    }

    .compact {
      margin: var(--ds-spacing-1);
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
      .stat-icon {
        width: 40px;
        height: 40px;
        font-size: 1.25rem;
      }

      .stat-value {
        font-size: 1.5rem;
      }

      .stat-content {
        padding-left: var(--ds-spacing-2);
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
      case 'positive': return 'trending-up-outline';
      case 'negative': return 'trending-down-outline';
      default: return 'remove-outline';
    }
  }
}