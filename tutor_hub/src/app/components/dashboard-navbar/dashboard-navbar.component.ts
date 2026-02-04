import { Component, input, output, model, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-dashboard-navbar',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './dashboard-navbar.component.html',
  styles: []
})
export class DashboardNavbarComponent {
  
  userParams = input<any>({}); 
  activeTab = input<string>('explore');
  isDarkMode = input<boolean>(false);
  searchTerm = model<string>(''); 
  tabs = input<{ id: string, label: string }[]>([]);

  tabChange = output<string>();
  themeToggle = output<void>();
  logout = output<void>();

  
  // ✅ New States
  showProfileMenu = signal<boolean>(false);
  showNotifications = signal<boolean>(false);
  showMobileMenu = signal<boolean>(false);
  showLogoutModal = false;

  // Mock Notifications
  notifications = [
    { text: 'New course "Angular 18" added.', time: '2m ago', read: false },
    { text: 'Your enrollment was approved.', time: '1h ago', read: false },
    { text: 'Welcome to TutorHub!', time: '1d ago', read: true }
  ];

  
  toggleProfileMenu() { this.showProfileMenu.update(v => !v); this.showNotifications.set(false); }
  toggleNotifications() { this.showNotifications.update(v => !v); this.showProfileMenu.set(false); }
  toggleMobileMenu() { this.showMobileMenu.update(v => !v); }
  
  closeMenus() {
    this.showProfileMenu.set(false);
    this.showNotifications.set(false);
    this.showMobileMenu.set(false);
  
  }
  
  get unreadCount() {
    return this.notifications.filter(n => !n.read).length;
  }
}