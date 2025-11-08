import {Component, inject, OnInit} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {TranslateService} from '@ngx-translate/core';
import {CheckedMenu} from '../../../../../shared-modules/src/lib/checked-menu/checked-menu';
import {Menubar} from 'primeng/menubar';
import {MenuItem} from 'primeng/api';

@Component({
  selector: 'app-monitoring-menu',
  templateUrl: './monitoring-menu.component.html',
  styleUrl: './monitoring-menu.component.css',
  imports: [FormsModule, Menubar],
  standalone: true,
})
export class MonitoringMenuComponent extends CheckedMenu implements OnInit {
  protected readonly translateService: TranslateService = inject(TranslateService);
  protected items: MenuItem[] | undefined;

  ngOnInit() {
    this.items = [
      {
        label: this.translateService.instant('MENU.MONITORING.NODES'),
        routerLink: '/monitoring/nodes',
        id: 'nodes'
      },
    ];
  }
}
