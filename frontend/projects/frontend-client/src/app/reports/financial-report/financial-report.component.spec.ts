import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinancialReportComponent } from './financial-report.component';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { mockRoute } from '../../../mocks/mock-activated-route';
import { KEYCLOAK_EVENT_SIGNAL } from 'keycloak-angular';
import { MOCK_KEYCLOAK_EVENT_SIGNAL } from '../../../mocks/mock-keycloak-signal';
import Keycloak from 'keycloak-js';
import { MockKeycloak } from '../../../mocks/mock-keycloak';
import { testComponentTranslation } from '../../../mocks/test-functions';
import { AccountsStore } from '../../accounts/accounts.signal-store';
import { ReportStore } from '../reports.signal-store';
import {
  mockAccountsStore,
  mockPropertyStore,
  mockReportsStore,
} from '../../../mocks/mock-store';
import { PropertyStore } from '../../properties/properties.signal-store';
import { provideTranslateTestingService } from '../../../mocks/fake-translation-loader';
import assets_en from '../../../assets/i18n/en.json';
import assets_pl from '../../../assets/i18n/pl.json';

describe('FinancialReportComponent', () => {
  let component: FinancialReportComponent;
  let fixture: ComponentFixture<FinancialReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FinancialReportComponent],
      providers: [
        FormBuilder,
        ReactiveFormsModule,
        { provide: AccountsStore, useValue: mockAccountsStore },
        { provide: PropertyStore, useValue: mockPropertyStore },
        { provide: ReportStore, useValue: mockReportsStore },
        { provide: ActivatedRoute, useValue: mockRoute },
        {
          provide: KEYCLOAK_EVENT_SIGNAL,
          useValue: MOCK_KEYCLOAK_EVENT_SIGNAL,
        },
        { provide: Keycloak, useClass: MockKeycloak },
        provideTranslateTestingService({
          en: assets_en,
          pl: assets_pl,
        }),
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
    testComponentTranslation(
      FinancialReportComponent,
      'en',
      '#report',
      'Generate report',
    );
  });

  it('should render page in proper language', () => {
    testComponentTranslation(
      FinancialReportComponent,
      'pl',
      '#report',
      'Generuj raport',
    );
  });
});
