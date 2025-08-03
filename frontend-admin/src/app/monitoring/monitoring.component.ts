import {Component} from '@angular/core';
import {MonitoringModule} from './monitoring-module';
import {MonitoringMenuComponent} from './monitoring-menu/monitoring-menu.component';

@Component({
  selector: 'app-statistics',
  templateUrl: './monitoring.component.html',
  imports: [
    MonitoringMenuComponent,
    MonitoringModule
  ],
  styleUrl: './monitoring.component.css'
})
export class MonitoringComponent {

}
