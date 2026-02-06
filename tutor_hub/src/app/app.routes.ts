import { Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
import { NoAuthGuard } from './guards/no-auth.guard';
import { AdminGuard } from './guards/admin.guard';
import { TeacherGuard } from './guards/teacher.guard';
import { StudentGuard } from './guards/student.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/home',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login.component').then(m => m.LoginComponent),
    canActivate: [NoAuthGuard]
  },
  {
    path: 'signup',
    loadComponent: () => import('./pages/signup/signup.component').then(m => m.SignupComponent),
    canActivate: [NoAuthGuard]
  },
  {
    path: 'home',
    loadComponent: () => import('./pages/home/home.component').then(m => m.HomeComponent)
  },
  {
    path: 'about',
    loadComponent: () => import('./pages/about/about.component').then(m => m.AboutComponent)
  },
  {
    path: 'services',
    loadComponent: () => import('./pages/services/services.component').then(m => m.ServicesComponent)
  },
  {
    path: 'contact',
    loadComponent: () => import('./pages/contact/contact.component').then(m => m.ContactComponent)
  },
  {
    path: 'faq',
    loadComponent: () => import('./pages/faq/faq.component').then(m => m.FaqComponent)
  },
  {
    path: 'support',
    loadComponent: () => import('./pages/support/support.component').then(m => m.SupportComponent)
  },
  {
    path: 'resources',
    loadComponent: () => import('./pages/resources/resources.component').then(m => m.ResourcesComponent)
  },
  {
    path: 'guidelines',
    loadComponent: () => import('./pages/guidelines/guidelines.component').then(m => m.GuidelinesComponent)
  },
  {
    path: 'earnings',
    loadComponent: () => import('./pages/earnings/earnings.component').then(m => m.EarningsComponent)
  },
  {
    path: 'teacher',
    loadComponent: () => import('./pages/teacher/teacher-dashboard/teacher-dashboard.component').then(m => m.TeacherDashboardComponent),
    canActivate: [AuthGuard, TeacherGuard]
  },
  {
    path: 'student',
    loadComponent: () => import('./pages/student/student-dashboard/student-dashboard.component').then(m => m.StudentDashboardComponent),
    canActivate: [AuthGuard, StudentGuard]
  },
  {
    path: 'admin',
    loadComponent: () => import('./pages/admin/admin-dashboard/admin-dashboard.component').then(m => m.AdminDashboardComponent),
    canActivate: [AuthGuard, AdminGuard]
  },
  {
    path: 'privacy',
    loadComponent: () => import('./pages/privacy/privacy.component').then(m => m.PrivacyComponent)
  },
  {
    path: 'terms',
    loadComponent: () => import('./pages/terms/terms.component').then(m => m.TermsComponent)
  },
  {
    path: 'cookies',
    loadComponent: () => import('./pages/cookies/cookies.component').then(m => m.CookiesComponent)
  },
  {
    path: '**',
    redirectTo: '/home'
  }
];
