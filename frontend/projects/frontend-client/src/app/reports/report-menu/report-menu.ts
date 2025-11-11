import {Component, OnInit} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {Menubar} from 'primeng/menubar';
import {CheckedMenu} from '../../../../../shared-modules/src/lib/checked-menu/checked-menu';

@Component({
  selector: 'app-report-menu',
  imports: [ReactiveFormsModule, FormsModule, Menubar],
  templateUrl: './report-menu.html',
  styleUrl: './report-menu.scss',
})
export class ReportMenu extends CheckedMenu implements OnInit {

  ngOnInit() {
    this.items = [
      {
        label: this.translateService.instant('MENU.REPORTS.FINANCIAL'),
        routerLink: '/reports/financial-report',
        id: 'reportFinancial'
      }
    ];
  }
}
