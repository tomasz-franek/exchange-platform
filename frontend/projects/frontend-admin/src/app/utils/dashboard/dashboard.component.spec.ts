import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardComponent } from './dashboard.component';
import Keycloak from 'keycloak-js';
import { MockKeycloak } from '../../../mocks/mock-keycloak';
import { KEYCLOAK_EVENT_SIGNAL } from 'keycloak-angular';
import { MOCK_KEYCLOAK_EVENT_SIGNAL } from '../../../mocks/mock-keycloak-signal';
import { ActivatedRoute } from '@angular/router';
import { mockRoute } from '../../../mocks/activated-route-mock';
import { testComponentTranslation } from '../../../mocks/test-functions';
import {
  mockBuildInfoStore,
  mockPropertyStore,
} from '../../../mocks/mock-store';
import { PropertyStore } from '../../properties/properties.signal-store';
import { UtilStore } from '../utils.signal-store';
import { MessageService } from 'primeng/api';
import { provideTranslateTestingService } from '../../../mocks/fake-translation-loader';
import assets_en from '../../../assets/i18n/en.json';
import assets_pl from '../../../assets/i18n/pl.json';

describe('DashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [DashboardComponent],
      providers: [
        MessageService,
        { provide: ActivatedRoute, useValue: mockRoute },
        { provide: UtilStore, useValue: mockBuildInfoStore },
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

    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render page in english (default)', () => {
    testComponentTranslation(
      DashboardComponent,
      'en',
      '#welcome',
      'Welcome in the Exchange System',
    );
  });

  it('should render page in proper language', () => {
    testComponentTranslation(
      DashboardComponent,
      'pl',
      '#welcome',
      'Witamy w systemie wymiany walut',
    );
  });
});
