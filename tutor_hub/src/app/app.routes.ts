import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { SignupComponent } from './pages/signup/signup.component';
import { DashboardComponent } from './pages/student-dashboard/dashboard.component';

export const routes: Routes = [
  // Default Route: Agar koi sirf website khole, toh Login par bhej do
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  
  // Login Route
  { path: 'login', component: LoginComponent },
  
  // Signup Route
  { path: 'signup', component: SignupComponent },

  { path: 'dashboard', component: DashboardComponent },


  // Wildcard Route: Agar koi galat URL dale (e.g. /abcd), toh Login par bhej do
  { path: '**', redirectTo: 'login' },

];