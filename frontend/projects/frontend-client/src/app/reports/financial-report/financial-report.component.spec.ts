import {ComponentFixture, TestBed} from '@angular/core/testing';

import {FinancialReportComponent} from './financial-report.component';
import {FormBuilder, ReactiveFormsModule} from '@angular/forms';
import {provideToastr} from 'ngx-toastr';
import {provideMockStore} from '@ngrx/store/testing';
import {initialTicketState} from '../../tickets/state/ticket.reducers';
import {ActivatedRoute} from '@angular/router';
import {mockRoute} from '../../../mocks/mock-activated-route';
import {KEYCLOAK_EVENT_SIGNAL} from 'keycloak-angular';
import {MOCK_KEYCLOAK_EVENT_SIGNAL} from '../../../mocks/mock-keycloak-signal';
import Keycloak from 'keycloak-js';
import {MockKeycloak} from '../../../mocks/mock-keycloak';
import {testComponentTranslation, testTranslations,} from '../../../mocks/test-functions';

describe('FinancialReportComponent', () => {
  let component: FinancialReportComponent;
  let fixture: ComponentFixture<FinancialReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FinancialReportComponent, testTranslations()],
      providers: [
        FormBuilder,
        ReactiveFormsModule,
        provideToastr(),
        provideMockStore({initialState: initialTicketState}),
        {provide: ActivatedRoute, useValue: mockRoute},
        {
          provide: KEYCLOAK_EVENT_SIGNAL,
          useValue: MOCK_KEYCLOAK_EVENT_SIGNAL,
        },
        {provide: Keycloak, useClass: MockKeycloak},
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(FinancialReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render page in english (default)', () => {
    testComponentTranslation(FinancialReportComponent, 'en', '#report', 'Generate report');
  });

  it('should render page in proper language', () => {
    testComponentTranslation(FinancialReportComponent, 'pl', '#report', 'Generuj raport');
  });
});
