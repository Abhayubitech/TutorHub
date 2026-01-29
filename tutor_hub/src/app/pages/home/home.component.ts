import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  mobileMenuOpen = false;
  contactName = '';
  contactEmail = '';
  contactMessage = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  get isAuthenticated() {
    return this.authService.isAuthenticated();
  }

  get user() {
    return this.authService.user();
  }

  navigateToDashboard(): void {
    const user = this.authService.user();
    if (user) {
      const route = user.role === 'teacher' ? '/teacher' : user.role === 'admin' ? '/admin' : '/student';
      this.router.navigate([route]);
    }
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/home']);
  }

  goToLogin(): void {
    this.router.navigate(['/login']);
  }

  goToSignup(): void {
    this.router.navigate(['/signup']);
  }

  goToHome(): void {
    this.router.navigate(['/home']);
  }

  scrollToSection(sectionId: string): void {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }

  toggleMobileMenu(): void {
    this.mobileMenuOpen = !this.mobileMenuOpen;
  }

  submitContact(): void {
    // Validate contact form
    if (this.contactName && this.contactEmail && this.contactMessage) {
      // Check if name contains only letters, spaces, hyphens, and apostrophes
      const nameRegex = /^[a-zA-Z\s'-]*$/;
      if (!nameRegex.test(this.contactName)) {
        alert('Name can only contain letters, spaces, hyphens, and apostrophes');
        return;
      }

      // Check if name length is max 33
      if (this.contactName.length > 33) {
        alert('Name must be maximum 33 characters');
        return;
      }

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(this.contactEmail)) {
        alert('Please enter a valid email address');
        return;
      }

      // If validation passes, submit the form
      console.log('Contact form submitted:', {
        name: this.contactName,
        email: this.contactEmail,
        message: this.contactMessage
      });

      // Reset form
      this.contactName = '';
      this.contactEmail = '';
      this.contactMessage = '';
      
      alert('Thank you for contacting us! We will get back to you soon.');
    }
  }

  isValidName(name: string): boolean {
    const nameRegex = /^[a-zA-Z\s'-]*$/;
    return nameRegex.test(name) && name.length <= 33;
  }

  isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
}
