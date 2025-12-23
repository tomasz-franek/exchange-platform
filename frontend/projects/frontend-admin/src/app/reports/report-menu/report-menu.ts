import {Component, OnInit} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {CheckedMenu} from '../../../../../shared-modules/src/lib/checked-menu/checked-menu';
import {Menubar} from 'primeng/menubar';

@Component({
  selector: 'app-report-menu',
  templateUrl: './report-menu.html',
  imports: [FormsModule, Menubar],
  styleUrl: './report-menu.scss',
})
export class ReportMenu extends CheckedMenu implements OnInit {

  ngOnInit() {
    this.items = [
      {
        label: this.translateService.instant('MENU.REPORTS.TRANSACTION_LIST'),
        routerLink: '/reports/report-transactions',
        id: 'reportTransactionList'
      },
      {
        label: this.translateService.instant('MENU.REPORTS.ERROR_LIST'),
        routerLink: '/reports/report-errors',
        id: 'reportErrorList'
      },
      {
        label: this.translateService.instant('MENU.REPORTS.PAIRS'),
        routerLink: '/reports/report-pairs',
        id: 'reportPairs'
      },
    ];
  }
}
