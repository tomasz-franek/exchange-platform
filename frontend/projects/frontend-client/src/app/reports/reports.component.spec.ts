import {ComponentFixture, TestBed} from '@angular/core/testing';
import {ActivatedRoute} from '@angular/router';
import {mockRoute} from '../../mocks/mock-activated-route';
import {ReportsComponent} from './reports.component';
import Keycloak from 'keycloak-js';
import {MockKeycloak} from '../../mocks/mock-keycloak';
import {KEYCLOAK_EVENT_SIGNAL} from 'keycloak-angular';
import {MOCK_KEYCLOAK_EVENT_SIGNAL} from '../../mocks/mock-keycloak-signal';
import {testComponentTranslation, testTranslations,} from '../../mocks/test-functions';

describe('ReportsComponent', () => {
  let component: ReportsComponent;
  let fixture: ComponentFixture<ReportsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReportsComponent, testTranslations()],
      providers: [
        {provide: ActivatedRoute, useValue: mockRoute},
        {
          provide: KEYCLOAK_EVENT_SIGNAL,
          useValue: MOCK_KEYCLOAK_EVENT_SIGNAL,
        },
        {provide: Keycloak, useClass: MockKeycloak},
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ReportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render page in english (default)', () => {
    testComponentTranslation(
      ReportsComponent,
      'en',
      '#reportFinancial',
      'Financial report',
    );
  });

  it('should render page in proper language', () => {
    testComponentTranslation(
      ReportsComponent,
      'pl',
      '#reportFinancial',
      'Raport finansowy',
    );
  });
});
