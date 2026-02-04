import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MonitoringNodesComponent } from './monitoring-nodes.component';
import { ActivatedRoute } from '@angular/router';
import { mockRoute } from '../../../mocks/activated-route-mock';
import Keycloak from 'keycloak-js';
import { MockKeycloak } from '../../../mocks/mock-keycloak';
import { KEYCLOAK_EVENT_SIGNAL } from 'keycloak-angular';
import { MOCK_KEYCLOAK_EVENT_SIGNAL } from '../../../mocks/mock-keycloak-signal';
import { testComponentTranslation } from '../../../mocks/test-functions';
import { MonitoringStore } from '../monitoring.signal-store';
import {
  mockMonitoringStore,
  mockPropertyStore,
} from '../../../mocks/mock-store';
import { PropertyStore } from '../../properties/properties.signal-store';
import { provideTranslateTestingService } from '../../../mocks/fake-translation-loader';
import assets_en from '../../../assets/i18n/en.json';
import assets_pl from '../../../assets/i18n/pl.json';

describe('MonitoringNodesComponent', () => {
  let component: MonitoringNodesComponent;
  let fixture: ComponentFixture<MonitoringNodesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [MonitoringNodesComponent],
      providers: [
        { provide: ActivatedRoute, useValue: mockRoute },
        { provide: MonitoringStore, useValue: mockMonitoringStore },
        { provide: PropertyStore, useValue: mockPropertyStore },
        { provide: Keycloak, useClass: MockKeycloak },
        {
          provide: KEYCLOAK_EVENT_SIGNAL,
          useValue: MOCK_KEYCLOAK_EVENT_SIGNAL,
        },
        provideTranslateTestingService({
          en: assets_en,
          pl: assets_pl,
        }),
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
    testComponentTranslation(
      MonitoringNodesComponent,
      'en',
      '#labelStatus',
      'Status Module',
    );
  });

  it('should render page in proper language', () => {
    testComponentTranslation(
      MonitoringNodesComponent,
      'pl',
      '#labelStatus',
      'Status modułu',
    );
  });
});
