import { Routes } from '@angular/router';
import { LandingComponent } from './pages/landing/landing.component';
import { LoginComponent } from './pages/login/login.component';
import { SignupComponent } from './pages/signup/signup.component';
import { DashboardComponent } from './pages/student-dashboard/dashboard.component';
import { authGuard } from './guards/auth.guard'; // ✅ Guard Import karein

export const routes: Routes = [
  // ✅ Default Route: Landing Page
  { path: '', component: LandingComponent },
  
  // Login Route
  { path: 'login', component: LoginComponent },
  
  // Signup Route
  { path: 'signup', component: SignupComponent },

  // ✅ PROTECTED ROUTE: Sirf logged-in users hi ja sakte hain
  { 
    path: 'dashboard', 
    component: DashboardComponent,
    canActivate: [authGuard] // 🔒 Guard lagaya
  },

  // Wildcard Route: Galat URL par Login par bhejo
  { path: '**', redirectTo: 'login' },
];