import {Component, inject, OnInit} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {FormsModule} from '@angular/forms';
import {CheckedMenu} from '../../../../../shared-modules/src/lib/checked-menu/checked-menu';
import {Menubar} from 'primeng/menubar';
import {MenuItem} from 'primeng/api';

@Component({
  selector: 'app-report-menu',
  templateUrl: './report-menu.html',
  imports: [FormsModule, Menubar],
  styleUrl: './report-menu.css',
})
export class ReportMenu extends CheckedMenu implements OnInit {
  protected readonly translateService: TranslateService = inject(TranslateService);
  protected items: MenuItem[] | undefined;

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
    ];
  }
}
