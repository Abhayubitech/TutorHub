import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-back-button',
  standalone: true,
  imports: [CommonModule],
  template: `
    <button class="back-button" (click)="goBack()" [title]="tooltip">
      <span class="back-icon">←</span>
      <span class="back-text" *ngIf="showText">{{ text }}</span>
    </button>
  `,
  styleUrl: './back-button.component.css'
})
export class BackButtonComponent {
  text = 'Back';
  tooltip = 'Go back to previous page';
  showText = true;

  constructor(private router: Router) {}

  goBack(): void {
    // Try to use browser history back first
    if (window.history.length > 1) {
      window.history.back();
    } else {
      // Fallback to navigating to home
      this.router.navigate(['/home']);
    }
  }
}
