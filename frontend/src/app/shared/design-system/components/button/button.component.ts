import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
export type ButtonSize = 'sm' | 'md' | 'lg';

@Component({
  selector: 'ds-button',
  standalone: true,
  imports: [CommonModule],
  template: `
    <button 
      [class]="buttonClasses"
      [disabled]="disabled || loading"
      (click)="handleClick($event)"
      [type]="type">
      
      <span *ngIf="loading" class="loading-spinner"></span>
      <ng-content *ngIf="!loading"></ng-content>
    </button>
  `,
  styles: [`
    .btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
      font-weight: 500;
      border: 1px solid transparent;
      border-radius: 0.375rem;
      transition: all 0.2s ease-in-out;
      cursor: pointer;
      text-decoration: none;
      font-family: inherit;
      
      &:focus {
        outline: 2px solid transparent;
        outline-offset: 2px;
        box-shadow: 0 0 0 2px rgba(46, 125, 50, 0.2);
      }
      
      &:disabled {
        opacity: 0.6;
        cursor: not-allowed;
        pointer-events: none;
      }
    }
    
    .btn-sm {
      padding: 0.5rem 0.75rem;
      font-size: 0.875rem;
      line-height: 1.25rem;
    }
    
    .btn-md {
      padding: 0.625rem 1rem;
      font-size: 1rem;
      line-height: 1.5rem;
    }
    
    .btn-lg {
      padding: 0.75rem 1.5rem;
      font-size: 1.125rem;
      line-height: 1.75rem;
    }
    
    .btn-primary {
      background-color: #2e7d32;
      color: white;
      border-color: #2e7d32;
    }
    
    .btn-primary:hover:not(:disabled) {
      background-color: #1b5e20;
      border-color: #1b5e20;
    }
    
    .btn-secondary {
      background-color: #ff9800;
      color: white;
      border-color: #ff9800;
    }
    
    .btn-secondary:hover:not(:disabled) {
      background-color: #f57c00;
      border-color: #f57c00;
    }
    
    .btn-outline {
      background-color: transparent;
      color: #2e7d32;
      border-color: #2e7d32;
    }
    
    .btn-outline:hover:not(:disabled) {
      background-color: #2e7d32;
      color: white;
    }
    
    .btn-ghost {
      background-color: transparent;
      color: #2e7d32;
      border-color: transparent;
    }
    
    .btn-ghost:hover:not(:disabled) {
      background-color: rgba(46, 125, 50, 0.1);
    }
    
    .btn-danger {
      background-color: #f44336;
      color: white;
      border-color: #f44336;
    }
    
    .btn-danger:hover:not(:disabled) {
      background-color: #d32f2f;
      border-color: #d32f2f;
    }
    
    .loading-spinner {
      width: 1rem;
      height: 1rem;
      border: 2px solid transparent;
      border-top: 2px solid currentColor;
      border-radius: 50%;
      animation: spin 1s linear infinite;
    }
    
    @keyframes spin {
      to { transform: rotate(360deg); }
    }
  `]
})
export class ButtonComponent {
  @Input() variant: ButtonVariant = 'primary';
  @Input() size: ButtonSize = 'md';
  @Input() disabled = false;
  @Input() loading = false;
  @Input() type: 'button' | 'submit' | 'reset' = 'button';
  
  @Output() clicked = new EventEmitter<Event>();
  
  get buttonClasses(): string {
    return `btn btn-${this.variant} btn-${this.size}`;
  }
  
  handleClick(event: Event): void {
    if (!this.disabled && !this.loading) {
      this.clicked.emit(event);
    }
  }
}