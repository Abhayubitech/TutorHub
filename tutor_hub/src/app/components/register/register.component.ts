import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router, RouterLink } from '@angular/router';

@Component({
    selector: 'app-register',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, RouterLink],
    template: `
    <div class="flex justify-center items-center h-screen bg-gray-100">
      <div class="bg-white p-8 rounded shadow-md w-96">
        <h2 class="text-2xl font-bold mb-4 text-center">Register</h2>
        <form [formGroup]="registerForm" (ngSubmit)="onSubmit()">
          <div class="mb-4">
            <label class="block text-gray-700">Name</label>
            <input formControlName="name" type="text" class="w-full p-2 border rounded mt-1">
          </div>
          <div class="mb-4">
            <label class="block text-gray-700">Email</label>
            <input formControlName="email" type="email" class="w-full p-2 border rounded mt-1">
          </div>
          <div class="mb-4">
            <label class="block text-gray-700">Password</label>
            <input formControlName="password" type="password" class="w-full p-2 border rounded mt-1">
          </div>
           <div class="mb-4">
            <label class="block text-gray-700">Role</label>
            <select formControlName="role" class="w-full p-2 border rounded mt-1">
                <option value="student">Student</option>
                <option value="teacher">Teacher</option>
            </select>
          </div>
           <div class="mb-6">
            <label class="block text-gray-700">Phone</label>
            <input formControlName="phone" type="text" class="w-full p-2 border rounded mt-1">
          </div>
          <button type="submit" [disabled]="registerForm.invalid" class="w-full bg-green-500 text-white p-2 rounded hover:bg-green-600 disabled:bg-green-300">
            Register
          </button>
        </form>
         <p class="mt-4 text-center">
            Already have an account? <a routerLink="/login" class="text-blue-500">Login</a>
        </p>
      </div>
    </div>
  `
})
export class RegisterComponent {
    fb = inject(FormBuilder);
    authService = inject(AuthService);
    router = inject(Router);

    registerForm = this.fb.group({
        name: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(6)]],
        role: ['student', Validators.required],
        phone: ['', Validators.required]
    });

    onSubmit() {
        if (this.registerForm.valid) {
            this.authService.register(this.registerForm.value).subscribe({
                next: () => {
                    alert('Registration successful! Please login.');
                    this.router.navigate(['/login']);
                },
                error: (err) => alert('Registration failed: ' + err.error.error)
            });
        }
    }
}
