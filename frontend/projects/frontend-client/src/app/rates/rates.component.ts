import {Component} from '@angular/core';
import {MenuComponent} from '../menu/menu.component';
import {RateMenuComponent} from './rate-menu/rate-menu.component';

@Component({
  selector: 'app-reports',
  templateUrl: './rates.component.html',
  imports: [RateMenuComponent, MenuComponent, RateMenuComponent],
  styleUrl: './rates.component.scss'
})
export class RatesComponent {

}
