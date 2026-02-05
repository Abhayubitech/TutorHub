import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms'; 
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { SweetToastService } from '../../services/sweet-toast.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, RouterLink, CommonModule], 
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  email = signal('');
  password = signal('');
  showPassword = signal(false); 

  authService = inject(AuthService);
  router = inject(Router);
  toast = inject(SweetToastService);

  passwordPattern = "^(?=.*[A-Za-z])(?=.*\\d)(?=.*[@$!%*#?&])[A-Za-z\\d@$!%*#?&]{8,}$";

  togglePassword() {
    this.showPassword.set(!this.showPassword());
  }

  onLogin() {
    const passwordRegex = new RegExp(this.passwordPattern);
    
    if (!this.isValidEmail(this.email())) {
      this.toast.error("Please enter a valid email address.");
      return;
    }

    if (!passwordRegex.test(this.password())) {
      this.toast.error("Password must be 8+ chars with letters, numbers, and special characters.");
      return;
    }

    const data = { email: this.email(), password: this.password() };

    this.authService.login(data).subscribe({
      next: (res: any) => {
        this.toast.success("Login Successful! 🎉");
        localStorage.setItem('token', res.token);
        localStorage.setItem('user', JSON.stringify(res.user)); 
  
        if (res.user.role === 'admin') {
            this.router.navigate(['/admin-dashboard']); 
        } else {
            this.router.navigate(['/dashboard']); 
        }
      },
      error: (err) => {
        const msg = err.error?.message || "Login Failed! Invalid credentials.";
        this.toast.error(msg);
      }
    });
  }

  isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
}