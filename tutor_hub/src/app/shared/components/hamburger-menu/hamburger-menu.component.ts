import { Component, EventEmitter, Input, Output } from '@angular/core';

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

  toggleMenu(): void {
    this.isOpen = !this.isOpen;
    this.menuToggle.emit(this.isOpen);
  }

  closeMenu(): void {
    this.isOpen = false;
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
