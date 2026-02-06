import { Component, signal, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { OtpService } from '../../services/otp.service';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css'
})
export class SignupComponent implements OnInit, OnDestroy {
  name = signal<string>('');
  email = signal<string>('');
  password = signal<string>('');
  phone = signal<string>('');
  role = signal<string>('student');
  showPassword = signal<boolean>(false);
  
  // OTP related signals
  otp = signal<string>('');
  isOtpSent = signal<boolean>(false);
  isOtpVerified = signal<boolean>(false);
  showOtpInput = signal<boolean>(false);
  
  // Validation errors
  nameError = signal<string>('');
  emailError = signal<string>('');
  passwordError = signal<string>('');
  otpError = signal<string>('');

  constructor(
    private authService: AuthService,
    private otpService: OtpService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // No need to hide footer anymore since we have auth footer
  }

  ngOnDestroy(): void {
    // No need to remove hide-footer class anymore
  }

  signup(): void {
    // Clear previous errors
    this.nameError.set('');
    this.emailError.set('');
    this.passwordError.set('');
    this.otpError.set('');
    
    // Validate name
    if (!this.name()) {
      this.nameError.set('Name is required');
      return;
    }
    
    if (this.name().length > 33) {
      this.nameError.set('Name must be 33 characters or less');
      return;
    }
    
    // Check for special characters and numbers in name (only letters, spaces, hyphens, and apostrophes allowed)
    const nameRegex = /^[a-zA-Z\s'-]+$/;
    if (!nameRegex.test(this.name())) {
      this.nameError.set('Name can only contain letters, spaces, hyphens, and apostrophes');
      return;
    }
    
    // Validate email
    if (!this.email()) {
      this.emailError.set('Email is required');
      return;
    }
    
    if (this.email().length > 33) {
      this.emailError.set('Email must be 33 characters or less');
      return;
    }
    
    // Additional email validation
    if (this.email().includes('..') || this.email().startsWith('.') || this.email().endsWith('.')) {
      this.emailError.set('Please enter a valid email address');
      return;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.email())) {
      this.emailError.set('Please enter a valid email address');
      return;
    }
    
    // Validate password
    if (!this.password()) {
      this.passwordError.set('Password is required');
      return;
    }
    
    if (this.password().length > 11) {
      this.passwordError.set('Password must be 11 characters or less');
      return;
    }
    
    if (this.password().length < 6) {
      this.passwordError.set('Password must be at least 6 characters long');
      return;
    }
    
    // Check if OTP is verified
    if (!this.isOtpVerified()) {
      this.otpError.set('Please verify your email with OTP first');
      return;
    }
    
    // Validate role
    if (!this.role()) {
      this.role.set('student'); // Default to student if not set
    }
    
    // All validations passed, proceed with signup
    this.authService.signup(
      this.name(),
      this.email(),
      this.password(),
      this.role(),
      this.phone() || undefined
    );

    // Redirect after successful signup
    setTimeout(() => {
      const user = this.authService.user();
      if (user) {
        const route = user.role === 'teacher' ? '/teacher' : user.role === 'admin' ? '/admin' : '/student';
        this.router.navigate([route]);
      }
    }, 1000);
  }

  preventInvalidChars(event: KeyboardEvent): void {
    const char = event.key;
    const allowedChars = /^[a-zA-Z\s'\-]$/;
    const allowedControlKeys = ['Backspace', 'Delete', 'Tab', 'Escape', 'Enter', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Home', 'End'];
    
    // Allow control keys and valid characters
    if (!allowedControlKeys.includes(char) && !allowedChars.test(char)) {
      event.preventDefault();
    }
  }

  validateName(): void {
    const nameValue = this.name();
    this.nameError.set('');
    
    if (nameValue && nameValue.length > 0) {
      // Check for numbers and special characters (only letters, spaces, hyphens, and apostrophes allowed)
      const nameRegex = /^[a-zA-Z\s'-]+$/;
      if (!nameRegex.test(nameValue)) {
        this.nameError.set('Name can only contain letters, spaces, hyphens, and apostrophes');
      }
    }
  }

  sendOTP(): void {
    // Clear previous OTP errors
    this.otpError.set('');
    
    // Validate email first
    if (!this.email()) {
      this.emailError.set('Email is required');
      return;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.email())) {
      this.emailError.set('Please enter a valid email address');
      return;
    }
    
    // Send OTP
    this.otpService.sendOTP(this.email()).subscribe({
      next: (response) => {
        this.isOtpSent.set(true);
        this.showOtpInput.set(true);
        // In development, show the OTP in console
        if (response.otp) {
          console.log('OTP for testing:', response.otp);
        }
      },
      error: (error) => {
        this.otpError.set(error.error?.message || 'Failed to send OTP');
      }
    });
  }

  verifyOTP(): void {
    // Clear previous OTP errors
    this.otpError.set('');
    
    if (!this.otp()) {
      this.otpError.set('OTP is required');
      return;
    }
    
    // Verify OTP
    this.otpService.verifyOTP(this.email(), this.otp()).subscribe({
      next: (response) => {
        this.isOtpVerified.set(true);
        this.showOtpInput.set(false);
      },
      error: (error) => {
        this.otpError.set(error.error?.message || 'Invalid OTP');
      }
    });
  }

  togglePasswordVisibility(): void {
    this.showPassword.update(prev => !prev);
  }

  goToLogin(): void {
    this.router.navigate(['/login']);
  }

  goHome(): void {
    this.router.navigate(['/home']);
  }

  get isLoading() {
    return this.authService.loading();
  }

  get error() {
    return this.authService.error();
  }
}
