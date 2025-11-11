import {Component} from '@angular/core';
import {PropertyMenu} from './property-menu/property-menu';
import {MenuComponent} from '../menu/menu.component';

@Component({
  selector: 'app-properties',
  templateUrl: './properties.component.html',
  imports: [PropertyMenu, MenuComponent],
  styleUrl: './properties.component.scss'
})
export class PropertiesComponent {

}
