import { Component, inject, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ProfileService } from '../../services/profile.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent implements OnInit {
  authService = inject(AuthService);
  profileService = inject(ProfileService);
  router = inject(Router);

  user: any = null;
  profileData: any = null;
  dashboardLink = '/login'; 
  isDropdownOpen = false;
  isSidebarOpen = false;
  private timeoutId: any;
  defaultPhoto = 'https://cdn-icons-png.flaticon.com/512/149/149071.png';

  isDarkMode = false;

  ngOnInit() {
    this.loadUserFromStorage();

    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      this.enableDarkMode();
    } else {
      this.disableDarkMode();
    }

    this.profileService.profileUpdated$.subscribe(() => {
       console.log("Navbar refreshing...");
       this.loadUserFromStorage();
    });
  }

  toggleTheme() {
    this.isDarkMode = !this.isDarkMode;
    if (this.isDarkMode) {
      this.enableDarkMode();
    } else {
      this.disableDarkMode();
    }
  }

  enableDarkMode() {
    this.isDarkMode = true;
    document.documentElement.classList.add('dark'); 
    localStorage.setItem('theme', 'dark');
  }

  disableDarkMode() {
    this.isDarkMode = false;
    document.documentElement.classList.remove('dark'); 
    localStorage.setItem('theme', 'light');
  }

  loadUserFromStorage() {
    const userString = localStorage.getItem('user');
    if (userString) {
      this.user = JSON.parse(userString);
      
      if (this.user.role === 'admin') {
          this.dashboardLink = '/admin-dashboard';
      } else {
          this.dashboardLink = '/dashboard';
      }

      this.loadProfileFromDB(); 
    }
  }

  loadProfileFromDB() {
    if (this.user) {
      this.profileService.getProfileData(this.user.role, this.user.id).subscribe({
        next: (res: any) => { 
            this.profileData = res; 
        },
        error: (err) => {
            console.log("Profile fetch error", err);
            this.profileData = this.user; 
        }
      });
    }
  }

  showDropdown() { if (this.timeoutId) clearTimeout(this.timeoutId); this.isDropdownOpen = true; }
  hideDropdown() { this.timeoutId = setTimeout(() => { this.isDropdownOpen = false; }, 300); }
  openSidebar() { this.isSidebarOpen = true; this.hideDropdown(); }
  closeSidebar() { this.isSidebarOpen = false; }

  goToEditProfile() {
    this.closeSidebar();
    this.router.navigate(['/profile'], { queryParams: { mode: 'edit' } });
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.user = null;
    this.profileData = null;
    this.router.navigate(['/']);
  }
}