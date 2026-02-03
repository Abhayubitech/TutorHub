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

  onItemClick(item: MenuItem): void {
    if (item.disabled) {
      return;
    }
    this.itemClick.emit(item);
    this.closeMenu();
  }
}
