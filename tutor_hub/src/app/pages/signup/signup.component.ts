import { Component, signal, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

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

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    document.body.classList.add('hide-footer');
  }

  ngOnDestroy(): void {
    document.body.classList.remove('hide-footer');
  }

  signup(): void {
    if (this.name() && this.email() && this.password() && this.role()) {
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
