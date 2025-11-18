import {ComponentFixture, TestBed} from '@angular/core/testing';

import {ReportTransactions} from './report-transactions';
import Keycloak from 'keycloak-js';
import {MockKeycloak} from '../../../mocks/mock-keycloak';
import {KEYCLOAK_EVENT_SIGNAL} from 'keycloak-angular';
import {MOCK_KEYCLOAK_EVENT_SIGNAL} from '../../../mocks/mock-keycloak-signal';
import {ActivatedRoute} from '@angular/router';
import {mockRoute} from '../../../mocks/activated-route-mock';
import {MenuComponent} from '../../menu/menu.component';
import {testComponentTranslation, testTranslations} from '../../../mocks/test-functions';

describe('ReportTransactions', () => {
  let component: ReportTransactions;
  let fixture: ComponentFixture<ReportTransactions>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReportTransactions, MenuComponent, testTranslations()],
      providers: [
        {provide: Keycloak, useClass: MockKeycloak},
        {
          provide: KEYCLOAK_EVENT_SIGNAL,
          useValue: MOCK_KEYCLOAK_EVENT_SIGNAL,
        },
        {provide: ActivatedRoute, useValue: mockRoute},
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ReportTransactions);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render page in english (default)', () => {
    testComponentTranslation(ReportTransactions, 'en', '#transactionReport', 'Generate Report');
  });

  it('should render page in proper language', () => {
    testComponentTranslation(ReportTransactions, 'pl', '#transactionReport', 'Generuj raport');
  });
});
