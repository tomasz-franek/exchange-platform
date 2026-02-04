import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MonitoringComponent } from './monitoring.component';
import { ActivatedRoute } from '@angular/router';
import { mockRoute } from '../../mocks/activated-route-mock';
import Keycloak from 'keycloak-js';
import { MockKeycloak } from '../../mocks/mock-keycloak';
import { KEYCLOAK_EVENT_SIGNAL } from 'keycloak-angular';
import { MOCK_KEYCLOAK_EVENT_SIGNAL } from '../../mocks/mock-keycloak-signal';
import { testComponentTranslation } from '../../mocks/test-functions';
import { PropertyStore } from '../properties/properties.signal-store';
import { mockPropertyStore } from '../../mocks/mock-store';
import { provideTranslateTestingService } from '../../mocks/fake-translation-loader';
import assets_en from '../../assets/i18n/en.json';
import assets_pl from '../../assets/i18n/pl.json';

describe('MonitoringComponent', () => {
  let component: MonitoringComponent;
  let fixture: ComponentFixture<MonitoringComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [MonitoringComponent],
      providers: [
        { provide: ActivatedRoute, useValue: mockRoute },
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

    fixture = TestBed.createComponent(MonitoringComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render page in english (default)', () => {
    testComponentTranslation(
      MonitoringComponent,
      'en',
      '#nodes',
      'System components',
    );
  });

  it('should render page in proper language', () => {
    testComponentTranslation(
      MonitoringComponent,
      'pl',
      '#nodes',
      'Komponenty systemu',
    );
  });
});
