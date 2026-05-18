import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { AvatarModule } from 'primeng/avatar';
import { BadgeModule } from 'primeng/badge';
import { MenuModule } from 'primeng/menu';
import { RippleModule } from 'primeng/ripple';
import { TooltipModule } from 'primeng/tooltip';

interface MenuDataItem {
  type: 'main' | 'sub';
  label?: string;
  icon?: string;
  children?: MenuDataItem[];
}

@Component({
  selector: 'app-sidebar',
  imports: [AvatarModule, BadgeModule, MenuModule, RippleModule, CommonModule, TooltipModule],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.scss',
})
export class Sidebar implements OnInit {
  isCollapsed = true;
  menuData: MenuDataItem[] = [];

  ngOnInit() {
    this.menuData = [
      { type: 'main', label: 'Home', icon: 'pi pi-home' },
      { type: 'main', label: 'Orders', icon: 'pi pi-table' },
      {
        type: 'main',
        label: 'Accounts',
        icon: 'pi pi-chart-bar',
        children: [
          { type: 'sub', label: 'Accounts list' },
          { type: 'sub', label: 'Create account' }
        ]
      },
    ];
  }

}
