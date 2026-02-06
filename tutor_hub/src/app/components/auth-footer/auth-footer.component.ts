import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-auth-footer',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './auth-footer.component.html',
  styleUrl: './auth-footer.component.css'
})
export class AuthFooterComponent {
  scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}
