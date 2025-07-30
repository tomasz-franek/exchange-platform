import {Component} from '@angular/core';
import {PropertyMenu} from '../property-menu/property-menu';

@Component({
  selector: 'app-property-settings',
  templateUrl: './property-settings.html',
  styleUrl: './property-settings.css',
  standalone: true,
  imports: [
    PropertyMenu
  ]
})
export class PropertySettings {

}
