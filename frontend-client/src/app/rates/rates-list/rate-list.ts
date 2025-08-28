import { Component, inject } from '@angular/core';
import { MenuComponent } from '../../menu/menu.component';
import { RateMenuComponent } from '../rate-menu/rate-menu.component';
import { Store } from '@ngrx/store';
import { RateState } from '../state/rate.selectors';

@Component({
  selector: 'app-rates-list',
  imports: [MenuComponent, RateMenuComponent],
  templateUrl: './rate-list.html',
  styleUrl: './rate-list.css',
})
export class RateList {
  private _storeRate$: Store<RateState> = inject(Store);
}
