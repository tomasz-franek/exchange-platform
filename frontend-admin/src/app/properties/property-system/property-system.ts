import { Component } from '@angular/core';
import { MenuComponent } from '../../menu/menu.component';
import { TranslatePipe } from '@ngx-translate/core';
import { PropertyMenu } from '../property-menu/property-menu';
import { SystemPropertyResponse } from '../../api';

@Component({
  selector: 'app-property-system',
  templateUrl: './property-system.html',
  styleUrl: './property-system.css',
  imports: [MenuComponent, TranslatePipe, PropertyMenu],
})
export class PropertySystem {
  protected systemPropertyResponse: SystemPropertyResponse | null = null;
}
