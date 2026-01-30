import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.css'
})
export class ContactComponent {
  contactName = '';
  contactEmail = '';
  contactMessage = '';

  submitContact(): void {
    if (this.contactName && this.contactEmail && this.contactMessage) {
      const nameRegex = /^[a-zA-Z\s'-]*$/;
      if (!nameRegex.test(this.contactName)) {
        alert('Name can only contain letters, spaces, hyphens, and apostrophes');
        return;
      }

      if (this.contactName.length > 33) {
        alert('Name must be maximum 33 characters');
        return;
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(this.contactEmail)) {
        alert('Please enter a valid email address');
        return;
      }

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
