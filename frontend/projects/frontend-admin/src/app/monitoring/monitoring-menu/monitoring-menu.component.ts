import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Menubar } from 'primeng/menubar';
import { BaseMenuComponent } from '../../base-menu-component/base-menu-component';

@Component({
  selector: 'app-monitoring-menu',
  templateUrl: './monitoring-menu.component.html',
  styleUrl: './monitoring-menu.component.scss',
  imports: [FormsModule, Menubar],
  standalone: true,
})
export class MonitoringMenuComponent extends BaseMenuComponent {
  override ngOnInit() {
    this.items = [
      {
        label: this.translateService.instant('MENU.MONITORING.NODES'),
        routerLink: '/monitoring/nodes',
        id: 'nodes',
      },
    ];
  }
}
