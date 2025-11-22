import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeService } from '../../theme.service';

@Component({
  selector: 'ds-theme-toggle',
  standalone: true,
  imports: [CommonModule],
  template: `
    <button 
      class="theme-toggle"
      (click)="toggleTheme()"
      [attr.aria-label]="'Switch to ' + (themeService.theme() === 'light' ? 'dark' : 'light') + ' theme'"
      title="Toggle theme">
      
      <svg *ngIf="themeService.theme() === 'light'" 
           class="icon" 
           fill="currentColor" 
           viewBox="0 0 20 20">
        <path fill-rule="evenodd" 
              d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" 
              clip-rule="evenodd" />
      </svg>
      
      <svg *ngIf="themeService.theme() === 'dark'" 
           class="icon" 
           fill="currentColor" 
           viewBox="0 0 20 20">
        <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
      </svg>
    </button>
  `,
  styles: [`
    .theme-toggle {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 2.5rem;
      height: 2.5rem;
      border: 1px solid var(--color-border);
      border-radius: var(--radius-md);
      background-color: var(--color-bg-primary);
      color: var(--color-text-primary);
      cursor: pointer;
      transition: all var(--transition-base);
    }
    
    .theme-toggle:hover {
      background-color: var(--color-bg-secondary);
      border-color: var(--color-primary-500);
    }
    
    .theme-toggle:focus {
      outline: 2px solid transparent;
      outline-offset: 2px;
      box-shadow: 0 0 0 2px var(--color-primary-500);
    }
    
    .theme-toggle:active {
      transform: scale(0.95);
    }
    
    .icon {
      width: 1.25rem;
      height: 1.25rem;
      transition: transform var(--transition-base);
    }
    
    .theme-toggle:hover .icon {
      transform: rotate(15deg);
    }
  `]
})
export class ThemeToggleComponent {
  themeService = inject(ThemeService);
  
  toggleTheme(): void {
    this.themeService.toggleTheme();
  }
}