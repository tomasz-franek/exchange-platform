import {ComponentFixture, TestBed} from '@angular/core/testing';

import {DashboardComponent} from './dashboard.component';
import Keycloak from 'keycloak-js';
import {MockKeycloak} from '../../../mocks/mock-keycloak';
import {KEYCLOAK_EVENT_SIGNAL} from 'keycloak-angular';
import {MOCK_KEYCLOAK_EVENT_SIGNAL} from '../../../mocks/mock-keycloak-signal';
import {ActivatedRoute} from '@angular/router';
import {mockRoute} from '../../../mocks/activated-route-mock';
import {testComponentTranslation, testTranslations} from '../../../mocks/test-functions';
import {mockBuildInfoStore, mockPropertyStore} from '../../../mocks/mock-store';
import {propertyStore} from '../../properties/properties.signal-store';
import {UtilsSignalStore} from '../utils.signal-store';
import {MessageService} from 'primeng/api';

describe('DashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardComponent, testTranslations()],
      providers: [
        MessageService,
        {provide: ActivatedRoute, useValue: mockRoute},
        {provide: UtilsSignalStore, useValue: mockBuildInfoStore},
        {provide: propertyStore, useValue: mockPropertyStore},
        {provide: Keycloak, useClass: MockKeycloak},
        {
          provide: KEYCLOAK_EVENT_SIGNAL,
          useValue: MOCK_KEYCLOAK_EVENT_SIGNAL,
        },
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
    testComponentTranslation(DashboardComponent, 'en', '#welcome', 'Welcome in the Exchange System');
  });

  it('should render page in proper language', () => {
    testComponentTranslation(DashboardComponent, 'pl', '#welcome', 'Witamy w systemie wymiany walut');
  });
});
