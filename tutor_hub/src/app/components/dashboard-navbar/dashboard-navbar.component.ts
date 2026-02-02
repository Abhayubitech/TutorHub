import { Component, input, output, model } from '@angular/core';
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
  
  // ✅ FIX: Use 'userParams' (and make sure 'user' variable is removed from this file)
  // using input<any>({}) makes it optional with a default empty object
  userParams = input<any>({}); 

  activeTab = input<string>('explore');
  isDarkMode = input<boolean>(false);

  // Two-way binding for search
  searchTerm = model<string>(''); 

  // Events
  tabChange = output<string>();
  themeToggle = output<void>();
  logout = output<void>();

  // ✅ FIX: Ye Input Missing tha!
  // Default value Student Tabs rakhi hai taaki purana code na tute
  tabs = input<{ id: string, label: string }[]>([
    { id: 'explore', label: 'Explore' },
    { id: 'requested', label: 'Requests' },
    { id: 'learning', label: 'My Learning' },
    { id: 'profile', label: 'Profile' }
  ]);
}