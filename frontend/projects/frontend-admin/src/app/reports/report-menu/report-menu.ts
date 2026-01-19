import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Menubar } from 'primeng/menubar';
import { BaseMenuComponent } from '../../base-menu-component/base-menu-component';

@Component({
  selector: 'app-report-menu',
  templateUrl: './report-menu.html',
  imports: [FormsModule, Menubar],
  styleUrl: './report-menu.scss',
})
export class ReportMenu extends BaseMenuComponent {
  override ngOnInit() {
    this.items = [
      {
        label: this.translateService.instant('MENU.REPORTS.TRANSACTION_LIST'),
        routerLink: '/reports/report-transactions',
        id: 'reportTransactionList',
      },
      {
        label: this.translateService.instant('MENU.REPORTS.ERROR_LIST'),
        routerLink: '/reports/report-errors',
        id: 'reportErrorList',
      },
      {
        label: this.translateService.instant('MENU.REPORTS.PAIRS'),
        routerLink: '/reports/report-pair',
        id: 'reportPair',
      },
    ];
  }
}
