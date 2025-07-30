import {Component} from '@angular/core';
import {PropertyMenu} from '../property-menu/property-menu';

@Component({
  selector: 'app-property-invoice',
  templateUrl: './property-invoice.html',
  styleUrl: './property-invoice.css',
  standalone: true,
  imports: [
    PropertyMenu
  ]
})
export class PropertyInvoice {

}
