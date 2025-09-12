import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';
import { StrategyData } from './strategy.data';

@Injectable({
  providedIn: 'root',
})
export class StrategiesService {
  private basePath;

  constructor(private http: HttpClient) {
    this.basePath = environment.INTERNAL_BASE_PATH;
  }

  public loadActuatorStrategyData(): Observable<StrategyData> {
    return this.http.get<StrategyData>(this.basePath + '/actuator/strategies');
  }
}
