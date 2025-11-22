import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonCard, IonCardHeader, IonCardTitle, IonCardSubtitle, IonCardContent } from '@ionic/angular/standalone';

@Component({
  selector: 'app-dashboard-card',
  standalone: true,
  imports: [CommonModule, IonCard, IonCardHeader, IonCardTitle, IonCardSubtitle, IonCardContent],
  template: `
    <ion-card [class]="cardClass" [attr.aria-label]="ariaLabel">
      <ion-card-header *ngIf="title || subtitle">
        <ion-card-title *ngIf="title">{{ title }}</ion-card-title>
        <ion-card-subtitle *ngIf="subtitle">{{ subtitle }}</ion-card-subtitle>
      </ion-card-header>
      <ion-card-content>
        <ng-content></ng-content>
      </ion-card-content>
    </ion-card>
  `,
  styles: [`
    ion-card {
      margin: var(--ds-spacing-4);
      border-radius: var(--ds-radius-lg);
      box-shadow: var(--ds-shadow-md);
      transition: var(--ds-transition-base);
    }

    ion-card.elevated {
      box-shadow: var(--ds-shadow-lg);
    }

    ion-card.compact ion-card-content {
      padding: var(--ds-spacing-3);
    }

    ion-card.interactive {
      cursor: pointer;
    }

    ion-card.interactive:hover {
      transform: translateY(-2px);
      box-shadow: var(--ds-shadow-xl);
    }

    ion-card-title {
      font-size: var(--ds-font-size-lg);
      font-weight: var(--ds-font-weight-semibold);
      color: var(--ds-color-text-primary);
    }

    ion-card-subtitle {
      font-size: var(--ds-font-size-sm);
      color: var(--ds-color-text-secondary);
      margin-top: var(--ds-spacing-1);
    }

    @media (max-width: 768px) {
      ion-card {
        margin: var(--ds-spacing-2);
      }
    }
  `]
})
export class DashboardCardComponent {
  @Input() title?: string;
  @Input() subtitle?: string;
  @Input() cardClass?: string;
  @Input() ariaLabel?: string;
}