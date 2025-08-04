import {Component, inject, OnInit} from '@angular/core';
import {TranslatePipe} from '@ngx-translate/core';
import {Store} from '@ngrx/store';
import {
  MonitoringState,
  selectAdminHealthCheck,
  selectExternalHealthCheck,
  selectInternalHealthCheck
} from '../state/monitoring.selectors';
import {
  loadActuatorAdminHealthCheckAction,
  loadActuatorExternalHealthCheckAction,
  loadActuatorInternalHealthCheckAction
} from '../state/monitoring.actions';


@Component({
  selector: 'app-monitoring-nodes',
  templateUrl: './monitoring-nodes.component.html',
  styleUrl: './monitoring-nodes.component.css',
  imports: [
    TranslatePipe
  ],
  standalone: true
})
export class MonitoringNodesComponent implements OnInit {
  private _storeMonitoring$: Store<MonitoringState> = inject(Store);
  protected statusAdmin: string | undefined = undefined;
  protected statusExternal: string | undefined = undefined;
  protected statusInternal: string | undefined = undefined;

  ngOnInit() {

    this._storeMonitoring$.dispatch(loadActuatorAdminHealthCheckAction());
    this._storeMonitoring$.dispatch(loadActuatorExternalHealthCheckAction());
    this._storeMonitoring$.dispatch(loadActuatorInternalHealthCheckAction());
    this._storeMonitoring$.select(selectAdminHealthCheck).subscribe(
      (data: any) => {
        if (Object.hasOwn(data, 'status')) {
          this.statusAdmin = data['status'];
        }
      },
      () => {
        this.statusAdmin = 'UNKNOWN';
      }
    );
    this._storeMonitoring$.select(selectInternalHealthCheck).subscribe(
      (data: any) => {
        if (Object.hasOwn(data, 'status')) {
          this.statusInternal = data['status'];
        }
      },
      () => {
        this.statusInternal = 'UNKNOWN';
      }
    );
    this._storeMonitoring$.select(selectExternalHealthCheck).subscribe(
      (data: any) => {
        if (Object.hasOwn(data, 'status')) {
          this.statusExternal = data['status'];
        }
      },
      () => {
        this.statusExternal = 'UNKNOWN';
      }
    );
  }

}


