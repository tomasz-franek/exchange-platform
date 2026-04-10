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
import { provideTranslateTestingService } from '../../../mocks/fake-translation-loader';
import assets_en from '../../../assets/i18n/en.json';
import assets_pl from '../../../assets/i18n/pl.json';
import { PropertyStore } from '../../properties/properties.signal-store';
import { mockPropertyStore } from '../../../mocks/mock-store';

describe('FinancialReportComponent', () => {
  let component: FinancialReportComponent;
  let fixture: ComponentFixture<FinancialReportComponent>;
  let reportStore: any;
  let accountsStore: any;

  beforeEach(() => {
    const accountsStoreSpy = jasmine.createSpyObj('AccountsStore', [
      'loadAccountBalanceList',
    ]);
    const reportStoreSpy = jasmine.createSpyObj('ReportStore', [
      'loadFinancialReportPdfDocument',
    ]);

    accountsStoreSpy.accountBalanceList = jasmine.createSpy().and.returnValue([
      {
        userAccountId: '123',
        currency: 'USD',
      },
      {
        userAccountId: '456',
        currency: 'EUR',
      },
    ]);

    TestBed.configureTestingModule({
      imports: [FinancialReportComponent],
      providers: [
        FormBuilder,
        ReactiveFormsModule,
        { provide: AccountsStore, useValue: accountsStoreSpy },
        { provide: ReportStore, useValue: reportStoreSpy },
        { provide: PropertyStore, useValue: mockPropertyStore },
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
    reportStore = TestBed.inject(ReportStore);
    accountsStore = TestBed.inject(AccountsStore);

    fixture = TestBed.createComponent(FinancialReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render page in English (default)', () => {
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

  describe('Component Initialization', () => {
    it('should initialize formGroup with correct validators', () => {
      expect(component.formGroup.get('month')).toBeTruthy();
      expect(component.formGroup.get('year')).toBeTruthy();
      expect(component.formGroup.get('accountId')).toBeTruthy();
      expect(component.formGroup.get('yearAndMonth')).toBeTruthy();
    });

    it('should have required validators on month, year, and accountId fields', () => {
      const monthControl = component.formGroup.get('month');
      const yearControl = component.formGroup.get('year');
      const accountIdControl = component.formGroup.get('accountId');

      expect(monthControl?.hasError('required')).toBe(true);
      expect(yearControl?.hasError('required')).toBe(true);
      expect(accountIdControl?.hasError('required')).toBe(true);
    });

    it('should initialize maxDate to today', () => {
      const today = new Date();
      expect(component.maxDate.toDateString()).toBe(today.toDateString());
    });

    it('should call loadAccountBalanceList on ngOnInit', () => {
      fixture.detectChanges();
      expect(accountsStore.loadAccountBalanceList).toHaveBeenCalled();
    });
  });

  describe('generateFinancialReport', () => {
    it('should generate financial report with valid form data', () => {
      component.formGroup.patchValue({
        month: 5,
        year: 2024,
        accountId: '123',
      });

      component.generateFinancialReport();

      expect(reportStore.loadFinancialReportPdfDocument).toHaveBeenCalledWith({
        month: 5,
        year: 2024,
        userAccountId: '123',
        currency: 'USD',
      });
    });

    it('should find currency from accountBalanceList by accountId', () => {
      component.formGroup.patchValue({
        month: 3,
        year: 2024,
        accountId: '456',
      });

      component.generateFinancialReport();

      expect(reportStore.loadFinancialReportPdfDocument).toHaveBeenCalledWith(
        jasmine.objectContaining({
          currency: 'EUR',
        }),
      );
    });

    it('should not call loadFinancialReportPdfDocument if currency is not found', () => {
      component.formGroup.patchValue({
        month: 3,
        year: 2024,
        accountId: 'Non-existent account',
      });

      component.generateFinancialReport();

      expect(reportStore.loadFinancialReportPdfDocument).not.toHaveBeenCalled();
    });

    it('should not call loadFinancialReportPdfDocument if accountId is null', () => {
      component.formGroup.patchValue({
        month: 3,
        year: 2024,
        accountId: null,
      });

      component.generateFinancialReport();

      expect(reportStore.loadFinancialReportPdfDocument).not.toHaveBeenCalled();
    });

    it('should pass correct FinancialReportRequest structure', () => {
      component.formGroup.patchValue({
        month: 12,
        year: 2025,
        accountId: '123',
      });

      component.generateFinancialReport();

      expect(reportStore.loadFinancialReportPdfDocument).toHaveBeenCalledWith(
        jasmine.objectContaining({
          month: 12,
          year: 2025,
          userAccountId: '123',
          currency: jasmine.any(String),
        }),
      );
    });
  });

  describe('dateSelect', () => {
    it('should update month and year from selected date', () => {
      const selectedDate = new Date(2024, 4, 15); // May 15, 2024

      component.dateSelect(selectedDate);

      expect(component.formGroup.get('month')?.value).toBe(5); // May (0-indexed + 1)
      expect(component.formGroup.get('year')?.value).toBe(2024);
    });

    it('should handle January correctly (month 0)', () => {
      const selectedDate = new Date(2024, 0, 1); // January 1, 2024

      component.dateSelect(selectedDate);

      expect(component.formGroup.get('month')?.value).toBe(1);
      expect(component.formGroup.get('year')?.value).toBe(2024);
    });

    it('should handle December correctly (month 11)', () => {
      const selectedDate = new Date(2024, 11, 31); // December 31, 2024

      component.dateSelect(selectedDate);

      expect(component.formGroup.get('month')?.value).toBe(12);
      expect(component.formGroup.get('year')?.value).toBe(2024);
    });

    it('should update yearAndMonth field without modification', () => {
      component.formGroup.patchValue({ yearAndMonth: null });
      const selectedDate = new Date(2024, 5, 10);

      component.dateSelect(selectedDate);

      // Assert - yearAndMonth should remain unchanged from formGroup setup
      expect(component.formGroup.get('yearAndMonth')?.value).toBe(null);
    });
  });

  describe('Form Validation', () => {
    it('should mark form as invalid when required fields are empty', () => {
      expect(component.formGroup.valid).toBe(false);
    });

    it('should mark form as valid when all required fields are filled', () => {
      component.formGroup.patchValue({
        month: 5,
        year: 2024,
        accountId: '123',
      });

      expect(component.formGroup.valid).toBe(true);
    });

    it('should allow yearAndMonth to be optional', () => {
      component.formGroup.patchValue({
        month: 5,
        year: 2024,
        accountId: '123',
        yearAndMonth: null,
      });

      expect(component.formGroup.valid).toBe(true);
    });
  });
});
