import {ComponentFixture, TestBed} from '@angular/core/testing';

import {ReportPairs} from './report-pairs';
import Keycloak from 'keycloak-js';
import {MockKeycloak} from '../../../mocks/mock-keycloak';
import {KEYCLOAK_EVENT_SIGNAL} from 'keycloak-angular';
import {MOCK_KEYCLOAK_EVENT_SIGNAL} from '../../../mocks/mock-keycloak-signal';
import {ActivatedRoute} from '@angular/router';
import {mockRoute} from '../../../mocks/activated-route-mock';
import {MenuComponent} from '../../menu/menu.component';
import {testComponentTranslation, testTranslations} from '../../../mocks/test-functions';

describe('ReportTransactions', () => {
  let component: ReportPairs;
  let fixture: ComponentFixture<ReportPairs>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReportPairs, MenuComponent, testTranslations()],
      providers: [
        {provide: Keycloak, useClass: MockKeycloak},
        {
          provide: KEYCLOAK_EVENT_SIGNAL,
          useValue: MOCK_KEYCLOAK_EVENT_SIGNAL,
        },
        {provide: ActivatedRoute, useValue: mockRoute},
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ReportPairs);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render page in english (default)', () => {
    testComponentTranslation(ReportPairs, 'en', '#transactionReport', 'Generate Report');
  });

  it('should render page in proper language', () => {
    testComponentTranslation(ReportPairs, 'pl', '#transactionReport', 'Generuj raport');
  });
});
