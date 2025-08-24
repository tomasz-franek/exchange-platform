import {ComponentFixture, TestBed} from '@angular/core/testing';

import {MonitoringNodesComponent} from './monitoring-nodes.component';
import {provideMockStore} from '@ngrx/store/testing';
import {initialMonitoringState} from '../state/monitoring.reducers';
import {ActivatedRoute} from '@angular/router';
import {mockRoute} from '../../../mocks/activated-route-mock';
import Keycloak from 'keycloak-js';
import {MockKeycloak} from '../../../mocks/mock-keycloak';
import {KEYCLOAK_EVENT_SIGNAL} from 'keycloak-angular';
import {MOCK_KEYCLOAK_EVENT_SIGNAL} from '../../../mocks/mock-keycloak-signal';
import {testComponentTranslation, testTranslations} from '../../../mocks/test-functions';

describe('MonitoringNodesComponent', () => {
  let component: MonitoringNodesComponent;
  let fixture: ComponentFixture<MonitoringNodesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MonitoringNodesComponent, testTranslations()],
      providers: [
        provideMockStore({initialState: initialMonitoringState}),
        {provide: ActivatedRoute, useValue: mockRoute},
        {provide: Keycloak, useClass: MockKeycloak},
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
    testComponentTranslation(fixture, 'en', '#labelStatus', 'Status Module');
  });

  it('should render page in proper language', () => {
    testComponentTranslation(fixture, 'pl', '#labelStatus', 'Status modułu');
  });
});
