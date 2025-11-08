import {Component, inject, Input, OnInit} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {Menubar} from 'primeng/menubar';
import {MenuItem} from 'primeng/api';

@Component({
  selector: 'app-report-menu',
  imports: [ReactiveFormsModule, FormsModule, Menubar],
  templateUrl: './report-menu.html',
  styleUrl: './report-menu.css',
})
export class ReportMenu implements OnInit {
  @Input() checkedInput: string | undefined;
  protected readonly translateService: TranslateService = inject(TranslateService);
  protected items: MenuItem[] | undefined;

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
