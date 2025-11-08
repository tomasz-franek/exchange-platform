import { Component, inject, OnInit } from '@angular/core';
import { MenuComponent } from '../../menu/menu.component';
import { TranslatePipe } from '@ngx-translate/core';
import { PropertyMenu } from '../property-menu/property-menu';
import { Store } from '@ngrx/store';
import {
  PropertyState,
  selectStrategyData,
} from '../state/properties.selectors';
import { loadStrategyDataAction } from '../state/properties.actions';
import { StrategyData } from '../services/strategy.data';

@Component({
  selector: 'app-property-system',
  templateUrl: './property-system.html',
  styleUrl: './property-system.css',
  imports: [MenuComponent, TranslatePipe, PropertyMenu],
})
export class PropertySystem implements OnInit {
  protected strategyData: StrategyData | null = null;
  private _storeProperty$: Store<PropertyState> = inject(Store);
  ngOnInit() {
    this._storeProperty$
      .select(selectStrategyData)
      .subscribe((strategyData) => {
        this.strategyData = strategyData;
      });
    this._storeProperty$.dispatch(loadStrategyDataAction());
  }
}
