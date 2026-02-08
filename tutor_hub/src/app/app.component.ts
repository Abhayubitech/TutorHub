import { Component } from '@angular/core';
import { RouterOutlet, Router } from '@angular/router';
import { FooterComponent } from './components/footer/footer.component';
import { AuthFooterComponent } from './components/auth-footer/auth-footer.component';
import { DashboardFooterComponent } from './components/dashboard-footer/dashboard-footer.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { CommonModule } from '@angular/common';
import { ThemeService } from './services/theme.service';
import { ConfirmationDialogContainerComponent } from './shared/components/confirmation-dialog-container/confirmation-dialog-container.component';
import { ToastComponent } from './shared/components/toast/toast.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent, FooterComponent, AuthFooterComponent, DashboardFooterComponent, CommonModule, ConfirmationDialogContainerComponent, ToastComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'tutor_hub';
  
  constructor(
    private router: Router,
    private themeService: ThemeService
  ) {}
  
  shouldShowFooter(): boolean {
    const currentUrl = this.router.url;
    return !currentUrl.includes('/login') && !currentUrl.includes('/signup');
  }
  
  shouldShowAuthFooter(): boolean {
    const currentUrl = this.router.url;
    return false; // Hide footer from login and signup pages
  }
  
  shouldShowDashboardFooter(): boolean {
    const currentUrl = this.router.url;
    return currentUrl.includes('/teacher') || currentUrl.includes('/student') || currentUrl.includes('/admin');
  }
  
  shouldShowNavbar(): boolean {
    const currentUrl = this.router.url;
    const isDashboardPage = currentUrl.includes('/teacher') || currentUrl.includes('/student') || currentUrl.includes('/admin');
    return !currentUrl.includes('/login') && !currentUrl.includes('/signup') && !isDashboardPage;
  }
}
