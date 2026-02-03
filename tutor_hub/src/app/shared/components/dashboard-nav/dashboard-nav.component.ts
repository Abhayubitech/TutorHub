import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface NavItem {
  id: string;
  label: string;
  icon?: string;
  badge?: string | number;
  disabled?: boolean;
}

@Component({
  selector: 'app-dashboard-nav',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard-nav.component.html',
  styleUrl: './dashboard-nav.component.css'
})
export class DashboardNavComponent {
  @Input() navItems: NavItem[] = [];
  @Input() activeTab: string = '';
  @Input() orientation: 'horizontal' | 'vertical' = 'horizontal';
  @Output() tabChange = new EventEmitter<string>();

  onTabClick(tabId: string): void {
    const item = this.navItems.find(item => item.id === tabId);
    if (item && !item.disabled) {
      this.tabChange.emit(tabId);
    }
  }

  onKeyDown(event: KeyboardEvent, tabId: string): void {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      this.onTabClick(tabId);
    }
  }
}
