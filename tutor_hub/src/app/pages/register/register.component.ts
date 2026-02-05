import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { SweetToastService } from '../../services/sweet-toast.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, RouterLink, CommonModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  // ✅ Signals
  name = signal('');
  email = signal('');
  phone = signal('');
  role = signal('student');
  password = signal('');
  confirmPassword = signal('');
  
  // ✅ Visibility Signals
  showPassword = signal(false);
  showConfirmPassword = signal(false); // Ye missing ho sakta hai

  authService = inject(AuthService);
  router = inject(Router);
  toast = inject(SweetToastService);

  // ✅ Validation Pattern
  passwordPattern = "^(?=.*[A-Za-z])(?=.*\\d)(?=.*[@$!%*#?&])[A-Za-z\\d@$!%*#?&]{8,}$";

  togglePassword() { 
    this.showPassword.set(!this.showPassword()); 
  }

  toggleConfirmPassword() { // Ye missing ho sakta hai
    this.showConfirmPassword.set(!this.showConfirmPassword());
  }

  onRegister() {
    const userData = {
      name: this.name(),
      email: this.email(),
      phone: this.phone(),
      role: this.role(),
      password: this.password()
    };

    this.authService.register(userData).subscribe({
      next: () => {
        this.toast.success("Account Created! Please Login.");
        this.router.navigate(['/login']);
      },
      error: (err) => {
        // Backend se aane wala message dikhayega (e.g., "Email already existed")
        this.toast.error(err.error?.message || "Registration Failed!");
      }
    });
  }
}