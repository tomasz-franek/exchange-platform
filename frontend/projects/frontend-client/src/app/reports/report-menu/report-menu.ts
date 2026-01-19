import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Menubar } from 'primeng/menubar';
import { BaseMenuComponent } from '../../base-menu-component/base-menu-component';

@Component({
  selector: 'app-report-menu',
  imports: [ReactiveFormsModule, FormsModule, Menubar],
  templateUrl: './report-menu.html',
  styleUrl: './report-menu.scss',
})
export class ReportMenu extends BaseMenuComponent {
  override ngOnInit() {
    this.items = [
      {
        label: this.translateService.instant('MENU.REPORTS.FINANCIAL'),
        routerLink: '/reports/financial-report',
        id: 'reportFinancial',
      },
    ];
  }
}
