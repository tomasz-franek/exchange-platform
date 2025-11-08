import {Component, OnInit} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {Menubar} from 'primeng/menubar';
import {CheckedMenu} from '../../../../../shared-modules/src/lib/checked-menu/checked-menu';

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
export class RateMenuComponent extends CheckedMenu implements OnInit {

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
