import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { SystemService } from '../api/api/system.service';
import { BuildInfo } from '../api/model/buildInfo';
import { environment } from '../../environments/environment';


@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private readonly systemService: SystemService = inject(SystemService);

  constructor() {

    this.systemService.configuration.basePath =      environment.ADMIN_BASE_PATH;
  }
  public loadBuildInfo(): Observable<BuildInfo> {
    return this.systemService.loadBuildInfo();
  }
}
