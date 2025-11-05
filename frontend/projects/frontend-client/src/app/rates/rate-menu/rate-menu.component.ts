import {Component, inject, Input, OnInit} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {TranslateService} from '@ngx-translate/core';
import {MenuItem} from 'primeng/api';
import {Menubar} from 'primeng/menubar';

@Component({
  selector: 'app-rate-menu',
  imports: [
    ReactiveFormsModule,
    FormsModule,
    Menubar
  ],
  templateUrl: './rate-menu.component.html',
  styleUrl: './rate-menu.component.css'
})
export class RateMenuComponent implements OnInit {
  @Input() checkedInput: string | undefined;
  protected readonly translateService: TranslateService = inject(TranslateService);
  protected items: MenuItem[] | undefined;

  ngOnInit() {
    this.items = [
      {
        label: this.translateService.instant('MENU.RATES.RATE_LIST'),
        routerLink: '/rates/rate-list',
        id: 'rateList'
      }
    ];
  }
}
