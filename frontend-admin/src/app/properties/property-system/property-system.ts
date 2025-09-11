import { Component, inject, OnInit } from '@angular/core';
import { MenuComponent } from '../../menu/menu.component';
import { TranslatePipe } from '@ngx-translate/core';
import { PropertyMenu } from '../property-menu/property-menu';
import { SystemPropertyResponse } from '../../api';
import { Store } from '@ngrx/store';
import {
  PropertyState,
  selectSystemPropertyResponse,
} from '../state/properties.selectors';
import { loadSystemPropertyAction } from '../state/properties.actions';

@Component({
  selector: 'app-property-system',
  templateUrl: './property-system.html',
  styleUrl: './property-system.css',
  imports: [MenuComponent, TranslatePipe, PropertyMenu],
})
export class PropertySystem implements OnInit {
  protected systemPropertyResponse: SystemPropertyResponse | null = null;
  private _storeProperty$: Store<PropertyState> = inject(Store);
  ngOnInit() {
    this._storeProperty$
      .select(selectSystemPropertyResponse)
      .subscribe((systemPropertyResponse) => {
        this.systemPropertyResponse = systemPropertyResponse;
      });
    this._storeProperty$.dispatch(loadSystemPropertyAction());
  }
}
