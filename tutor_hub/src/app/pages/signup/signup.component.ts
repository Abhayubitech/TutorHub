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
  countdownTimer = signal<number>(0);
  private countdownInterval: any = null;
  
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
    // Clear countdown interval
    if (this.countdownInterval) {
      clearInterval(this.countdownInterval);
    }
  }

  signup(): void {
    // Simple validation like contact page
    if (!this.name() || !this.isValidName(this.name())) {
      return;
    }
    
    if (!this.email() || !this.isValidEmail(this.email())) {
      return;
    }
    
    if (!this.password() || this.password().length < 6 || this.password().length > 11) {
      return;
    }
    
    // Check OTP verification if OTP was sent
    if (this.isOtpSent() && !this.isOtpVerified()) {
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
    
    // Start countdown timer (33 seconds)
    this.startCountdown();
    
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
        // Stop countdown on error
        if (this.countdownInterval) {
          clearInterval(this.countdownInterval);
          this.countdownTimer.set(0);
        }
      }
    });
  }
  
  private startCountdown(): void {
    // Clear any existing interval
    if (this.countdownInterval) {
      clearInterval(this.countdownInterval);
    }
    
    // Set initial countdown time
    this.countdownTimer.set(33);
    
    // Start countdown
    this.countdownInterval = setInterval(() => {
      const currentTime = this.countdownTimer();
      if (currentTime > 0) {
        this.countdownTimer.set(currentTime - 1);
      } else {
        clearInterval(this.countdownInterval);
        this.countdownInterval = null;
      }
    }, 1000);
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
        // Clear countdown timer on successful verification
        if (this.countdownInterval) {
          clearInterval(this.countdownInterval);
          this.countdownTimer.set(0);
        }
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

  onDemoChange(event: Event): void {
    const value = (event.target as HTMLSelectElement).value;
    // Quick demo credentials
    if (value === 'student') {
      this.name.set('Student Demo');
      this.email.set('student1@example.com');
      this.password.set('studentpass');
      this.role.set('student');
    } else if (value === 'teacher') {
      this.name.set('Teacher Demo');
      this.email.set('teacher1@example.com');
      this.password.set('teacherpass');
      this.role.set('teacher');
    }
  }

  get isLoading() {
    return this.authService.loading();
  }

  get error() {
    return this.authService.error();
  }

  isValidName(name: string): boolean {
    const nameRegex = /^[a-zA-Z\s'-]*$/;
    return nameRegex.test(name) && name.length <= 33;
  }

  isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  isValidPhone(phone: string): boolean {
    const phoneRegex = /^[\d+\-\s()]*$/;
    return phoneRegex.test(phone) && phone.length <= 20;
  }
}
