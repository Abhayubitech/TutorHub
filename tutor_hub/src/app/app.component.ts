import { Component } from '@angular/core';
import { RouterOutlet, Router } from '@angular/router';
import { FooterComponent } from './components/footer/footer.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { CommonModule } from '@angular/common';
import { ThemeService } from './services/theme.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent, FooterComponent, CommonModule],
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
  
  shouldShowNavbar(): boolean {
    const currentUrl = this.router.url;
    return !currentUrl.includes('/login') && !currentUrl.includes('/signup');
  }
}
