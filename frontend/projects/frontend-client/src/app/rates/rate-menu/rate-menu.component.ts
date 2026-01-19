import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Menubar } from 'primeng/menubar';
import { BaseMenuComponent } from '../../base-menu-component/base-menu-component';

@Component({
  selector: 'app-rate-menu',
  imports: [ReactiveFormsModule, FormsModule, Menubar],
  templateUrl: './rate-menu.component.html',
  styleUrl: './rate-menu.component.scss',
})
export class RateMenuComponent extends BaseMenuComponent {
  override ngOnInit() {
    this.items = [
      {
        label: this.translateService.instant('MENU.RATES.RATE_LIST'),
        routerLink: '/rates/rate-list',
        id: 'rateList',
      },
    ];
  }
}
