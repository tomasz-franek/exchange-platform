import {Component, inject, OnInit} from '@angular/core';
import {MenuComponent} from '../../menu/menu.component';
import {TranslatePipe} from '@ngx-translate/core';
import {PropertyMenu} from '../property-menu/property-menu';
import {StrategyData} from '../services/strategy.data';
import {PropertyStore} from '../properties.signal-store';

@Component({
  selector: 'app-property-system',
  templateUrl: './property-system.html',
  styleUrl: './property-system.scss',
  imports: [MenuComponent, TranslatePipe, PropertyMenu],
})
export class PropertySystem implements OnInit {
  protected strategyData: StrategyData | null = null;
  protected readonly store = inject(PropertyStore);

  ngOnInit() {
    this.store.loadActuatorStrategyData();
  }
}
