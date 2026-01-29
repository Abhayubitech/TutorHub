import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'app-login',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, RouterLink],
    template: `
    <div class="flex justify-center items-center h-screen bg-gray-100">
      <div class="bg-white p-8 rounded shadow-md w-96">
        <h2 class="text-2xl font-bold mb-4 text-center">Login</h2>
        <form [formGroup]="loginForm" (ngSubmit)="onSubmit()">
          <div class="mb-4">
            <label class="block text-gray-700">Email</label>
            <input formControlName="email" type="email" class="w-full p-2 border rounded mt-1">
          </div>
          <div class="mb-6">
            <label class="block text-gray-700">Password</label>
            <input formControlName="password" type="password" class="w-full p-2 border rounded mt-1">
          </div>
          <button type="submit" [disabled]="loginForm.invalid" class="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 disabled:bg-blue-300">
            Login
          </button>
        </form>
        <p class="mt-4 text-center">
            Don't have an account? <a routerLink="/register" class="text-blue-500">Register</a>
        </p>
      </div>
    </div>
  `
})
export class LoginComponent {
    fb = inject(FormBuilder);
    authService = inject(AuthService);

    loginForm = this.fb.group({
        email: ['', [Validators.required, Validators.email]],
        password: ['', Validators.required]
    });

    onSubmit() {
        if (this.loginForm.valid) {
            this.authService.login(this.loginForm.value).subscribe({
                error: (err) => alert('Login failed: ' + err.error.error)
            });
        }
    }
}
