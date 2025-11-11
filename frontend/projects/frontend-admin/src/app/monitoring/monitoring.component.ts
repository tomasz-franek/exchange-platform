import {Component} from '@angular/core';
import {MonitoringMenuComponent} from './monitoring-menu/monitoring-menu.component';
import {MenuComponent} from '../menu/menu.component';

@Component({
  selector: 'app-statistics',
  templateUrl: './monitoring.component.html',
  imports: [MonitoringMenuComponent, MenuComponent],
  styleUrl: './monitoring.component.scss'
})
export class MonitoringComponent {

}
