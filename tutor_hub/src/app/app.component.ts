import { Component, inject } from '@angular/core';
import { RouterOutlet, RouterLink } from '@angular/router';
import { AuthService } from './services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, CommonModule],
  template: `
    <nav class="bg-gray-800 p-4 text-white flex justify-between items-center">
        <a routerLink="/" class="text-xl font-bold">TutorHub</a>
        
        <div>
            @if (authService.currentUser()) {
                <span class="mr-4 text-gray-300">Hello, {{ authService.currentUser().name }}</span>
                <a routerLink="/dashboard" class="mr-4 hover:text-blue-300">Dashboard</a>
                <button (click)="authService.logout()" class="bg-red-500 px-3 py-1 rounded hover:bg-red-600">Logout</button>
            } @else {
                <a routerLink="/login" class="mr-4 hover:text-blue-300">Login</a>
                <a routerLink="/register" class="bg-blue-500 px-3 py-1 rounded hover:bg-blue-600">Register</a>
            }
        </div>
    </nav>
    <main>
        <router-outlet></router-outlet>
    </main>
  `
})
export class AppComponent {
  authService = inject(AuthService);
}
