import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-dashboard-footer',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './dashboard-footer.component.html',
  styleUrl: './dashboard-footer.component.css'
})
export class DashboardFooterComponent {
  scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}
