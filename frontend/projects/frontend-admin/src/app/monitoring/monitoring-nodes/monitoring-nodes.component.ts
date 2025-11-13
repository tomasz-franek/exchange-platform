import {Component, inject, OnInit} from '@angular/core';
import {TranslatePipe} from '@ngx-translate/core';
import {MenuComponent} from '../../menu/menu.component';
import {MonitoringMenuComponent} from '../monitoring-menu/monitoring-menu.component';
import {monitoringStore} from '../monitoring.signal-store';

@Component({
  selector: 'app-monitoring-nodes',
  templateUrl: './monitoring-nodes.component.html',
  styleUrl: './monitoring-nodes.component.scss',
  imports: [TranslatePipe, MenuComponent, MonitoringMenuComponent],
})
export class MonitoringNodesComponent implements OnInit {
  protected readonly store = inject(monitoringStore);

  ngOnInit() {

    this.store.loadActuatorAdminHealthCheck();
    this.store.loadActuatorInternalHealthCheck();
    this.store.loadActuatorExternalHealthCheck();
  }

}


