import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ContactService } from '../../services/contact.service';
import Swal from 'sweetalert2';

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
  contactSubject = '';
  contactMessage = '';
  
  // Validation error flags
  nameError = '';
  emailError = '';
  subjectError = '';
  messageError = '';

  constructor(
    private contactService: ContactService
  ) {}

  // Helper validation methods
  isValidName(name: string): boolean {
    const nameRegex = /^[a-zA-Z\s'-]*$/;
    return nameRegex.test(name) && name.length <= 33;
  }

  isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  // Real-time validation methods
  onNameChange(): void {
    if (!this.contactName.trim()) {
      this.nameError = "Name can't be empty";
    } else if (!this.isValidName(this.contactName)) {
      this.nameError = 'Name must contain only letters, spaces, hyphens, and apostrophes (max 33 characters)';
    } else {
      this.nameError = '';
    }
  }

  onEmailChange(): void {
    if (!this.contactEmail.trim()) {
      this.emailError = "Email can't be empty";
    } else if (!this.isValidEmail(this.contactEmail)) {
      this.emailError = 'Valid email is required';
    } else {
      this.emailError = '';
    }
  }

  onSubjectChange(): void {
    if (!this.contactSubject.trim()) {
      this.subjectError = "Subject can't be empty";
    } else if (this.contactSubject.length > 100) {
      this.subjectError = 'Subject must be maximum 100 characters';
    } else {
      this.subjectError = '';
    }
  }

  onMessageChange(): void {
    if (!this.contactMessage.trim()) {
      this.messageError = "Message can't be empty";
    } else {
      this.messageError = '';
    }
  }

  submitContact(): void {
    // Clear previous errors
    this.nameError = '';
    this.emailError = '';
    this.subjectError = '';
    this.messageError = '';
    
    // Run real-time validation
    this.onNameChange();
    this.onEmailChange();
    this.onSubjectChange();
    this.onMessageChange();
    
    // Check if there are any validation errors
    if (this.nameError || this.emailError || this.subjectError || this.messageError) {
      return;
    }

    // Submit to backend
    this.contactService.submitContactForm({
      name: this.contactName,
      email: this.contactEmail,
      subject: this.contactSubject,
      message: this.contactMessage
    }).subscribe(
      (response) => {
        if (response.success) {
            Swal.fire({
              icon: 'success',
              title: 'Success!',
              text: response.message,
              toast: true,
              position: 'top-end',
              showConfirmButton: false,
              timer: 5000,
              timerProgressBar: true,
              didOpen: (toast) => {
                toast.addEventListener('mouseenter', Swal.stopTimer)
                toast.addEventListener('mouseleave', Swal.resumeTimer)
              }
            });
            // Clear form
            this.contactName = '';
            this.contactEmail = '';
            this.contactSubject = '';
            this.contactMessage = '';
            // Clear validation errors
            this.nameError = '';
            this.emailError = '';
            this.subjectError = '';
            this.messageError = '';
          } else {
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: response.message || 'Failed to send message',
              toast: true,
              position: 'top-end',
              showConfirmButton: false,
              timer: 8000,
              timerProgressBar: true,
              didOpen: (toast) => {
                toast.addEventListener('mouseenter', Swal.stopTimer)
                toast.addEventListener('mouseleave', Swal.resumeTimer)
              }
            });
          }
        },
        (error) => {
          console.error('Contact form error:', error);
          console.error('Error details:', error.error);
          console.error('Error status:', error.status);
          
          let errorMessage = 'Failed to send message. Please try again later.';
          if (error.error && error.error.message) {
            errorMessage = `Server error: ${error.error.message}`;
          } else if (error.status) {
            errorMessage = `Network error: ${error.status} ${error.statusText || 'Unknown error'}`;
          }
          
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: errorMessage,
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 8000,
            timerProgressBar: true,
            didOpen: (toast) => {
              toast.addEventListener('mouseenter', Swal.stopTimer)
              toast.addEventListener('mouseleave', Swal.resumeTimer)
            }
          });
        }
      );
    }
  }
