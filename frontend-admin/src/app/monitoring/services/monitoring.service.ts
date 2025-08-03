import {inject, Injectable} from '@angular/core';
import {ActuatorAdminService} from '../../api/api/actuatorAdmin.service';
import {ActuatorExternalService} from '../../api';
import {ActuatorInternalService} from '../../api/api/actuatorInternal.service';
import {Observable} from 'rxjs/internal/Observable';

@Injectable({
  providedIn: 'root',
})
export class MonitoringService {
  private readonly actuatorAdminService: ActuatorAdminService = inject(ActuatorAdminService);
  private readonly actuatorExternalService: ActuatorExternalService = inject(ActuatorExternalService);
  private readonly actuatorInternalService: ActuatorInternalService = inject(ActuatorInternalService);

  public loadActuatorAdminHealthCheck(): Observable<object> {
    return this.actuatorAdminService.loadActuatorAdminHealthCheck()
  }

  public loadActuatorExternalHealthCheck(): Observable<object> {
    return this.actuatorExternalService.loadActuatorExternalHealthCheck()
  }

  public loadActuatorInternalHealthCheck(): Observable<object> {
    return this.actuatorInternalService.loadActuatorInternalHealthCheck()
  }
}
