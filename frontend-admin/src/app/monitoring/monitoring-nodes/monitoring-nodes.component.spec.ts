import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MonitoringNodesComponent } from './monitoring-nodes.component';
import { TranslateService } from '@ngx-translate/core';
import { provideMockStore } from '@ngrx/store/testing';
import { initialMonitoringState } from '../state/monitoring.reducers';
import { ActivatedRoute } from '@angular/router';
import { mockRoute } from '../../../mocks/activated-route-mock';
import Keycloak from 'keycloak-js';
import { MockKeycloak } from '../../../mocks/mock-keycloak';
import { KEYCLOAK_EVENT_SIGNAL } from 'keycloak-angular';
import { MOCK_KEYCLOAK_EVENT_SIGNAL } from '../../../mocks/mock-keycloak-signal';
import { testTranslations } from '../../../mocks/test-functions';

describe('MonitoringNodesComponent', () => {
  let component: MonitoringNodesComponent;
  let fixture: ComponentFixture<MonitoringNodesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MonitoringNodesComponent, testTranslations()],
      providers: [
        provideMockStore({ initialState: initialMonitoringState }),
        { provide: ActivatedRoute, useValue: mockRoute },
        { provide: Keycloak, useClass: MockKeycloak },
        {
          provide: KEYCLOAK_EVENT_SIGNAL,
          useValue: MOCK_KEYCLOAK_EVENT_SIGNAL,
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(MonitoringNodesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render page in english (default)', () => {
    const translateService = TestBed.inject(TranslateService);
    translateService.setDefaultLang('en');
    const fixture = TestBed.createComponent(MonitoringNodesComponent);

    fixture.detectChanges();
    const idElement: HTMLElement =
      fixture.nativeElement.querySelector('#labelStatus');
    expect(idElement.innerText).toContain('Status Module');
  });

  it('should render page in proper language', () => {
    const fixture = TestBed.createComponent(MonitoringNodesComponent);

    const translateService = TestBed.inject(TranslateService);
    translateService.use('pl');

    fixture.detectChanges();
    const idElement: HTMLElement =
      fixture.nativeElement.querySelector('#labelStatus');
    expect(idElement.innerText).toContain('Status modułu');
  });
});
