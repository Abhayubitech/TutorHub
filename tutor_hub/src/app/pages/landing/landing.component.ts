import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [CommonModule, RouterLink], // RouterLink zaroori hai navigation ke liye
  templateUrl: './landing.component.html',
  styles: []
})
export class LandingComponent {
  // Mobile menu state
  isMenuOpen = false;

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }
}