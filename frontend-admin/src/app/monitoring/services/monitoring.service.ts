import { inject, Injectable } from '@angular/core';
import { ActuatorAdminService } from '../../api/api/actuatorAdmin.service';
import { ActuatorInternalService } from '../../api/api/actuatorInternal.service';
import { Observable } from 'rxjs/internal/Observable';
import { environment } from '../../../environments/environment';
import { ActuatorExternalService } from '../../api/api/actuatorExternal.service';

@Injectable({
  providedIn: 'root',
})
export class MonitoringService {
  private readonly actuatorAdminService: ActuatorAdminService =
    inject(ActuatorAdminService);
  private readonly actuatorExternalService: ActuatorExternalService = inject(
    ActuatorExternalService,
  );
  private readonly actuatorInternalService: ActuatorInternalService = inject(
    ActuatorInternalService,
  );

  constructor() {
    this.actuatorAdminService.configuration.basePath =
      environment.ADMIN_BASE_PATH;
    this.actuatorExternalService.configuration.basePath =
      environment.EXTERNAL_BASE_PATH;
    this.actuatorInternalService.configuration.basePath =
      environment.INTERNAL_BASE_PATH;
  }

  public loadActuatorAdminHealthCheck(): Observable<object> {
    return this.actuatorAdminService.loadActuatorAdminHealthCheck();
  }

  public loadActuatorExternalHealthCheck(): Observable<object> {
    return this.actuatorExternalService.loadActuatorExternalHealthCheck();
  }

  public loadActuatorInternalHealthCheck(): Observable<object> {
    return this.actuatorInternalService.loadActuatorInternalHealthCheck();
  }
}
