import { Component, EventEmitter, Input, Output, signal } from '@angular/core';

export interface MenuItem {
  id: string;
  label: string;
  icon?: string;
  badge?: string;
  disabled?: boolean;
  active?: boolean;
}

@Component({
  selector: 'app-hamburger-menu',
  standalone: true,
  imports: [],
  templateUrl: './hamburger-menu.component.html',
  styleUrl: './hamburger-menu.component.css'
})
export class HamburgerMenuComponent {
  @Input() menuItems: MenuItem[] = [];
  @Input() isOpen: boolean = false;
  @Output() menuToggle = new EventEmitter<boolean>();
  @Output() itemClick = new EventEmitter<MenuItem>();
  
  menuTitle = signal<string>('Menu');

  toggleMenu(): void {
    this.isOpen = !this.isOpen;
    const titles = ['Navigation', 'Quick Access', 'Main Menu', 'Dashboard'];
    const randomTitle = titles[Math.floor(Math.random() * titles.length)];
    this.menuTitle.set(this.isOpen ? randomTitle : 'Menu');
    this.menuToggle.emit(this.isOpen);
  }

  closeMenu(): void {
    this.isOpen = false;
    this.menuTitle.set('Menu');
    this.menuToggle.emit(false);
  }

  async onItemClick(item: MenuItem): Promise<void> {
    console.log('Hamburger menu item clicked:', item.id, item.label);
    
    if (item.disabled) {
      console.log('Item is disabled, ignoring');
      return;
    }
    
    if (item.id === 'logout') {
      console.log('Logout clicked, emitting event');
      // For logout, emit the event and let parent handle the async operation
      // The parent component should close the menu after logout completes
      this.itemClick.emit(item);
      // Also close menu immediately for better UX
      this.closeMenu();
    } else {
      console.log('Other item clicked:', item.id);
      this.itemClick.emit(item);
      this.closeMenu();
    }
  }
}
