import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PropertyCurrencyRow } from './property-currency-row';
import { testComponentTranslation } from '../../../mocks/test-functions';
import { PropertyStore } from '../properties.signal-store';
import { mockPropertyStore } from '../../../mocks/mock-store';
import { provideTranslateTestingService } from '../../../mocks/fake-translation-loader';
import assets_en from '../../../assets/i18n/en.json';
import assets_pl from '../../../assets/i18n/pl.json';

describe('PropertyCurrencyRow', () => {
  let component: PropertyCurrencyRow;
  let fixture: ComponentFixture<PropertyCurrencyRow>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [PropertyCurrencyRow],
      providers: [
        { provide: PropertyStore, useValue: mockPropertyStore },
        provideTranslateTestingService({
          en: assets_en,
          pl: assets_pl,
        }),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(PropertyCurrencyRow);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render page in english (default)', () => {
    testComponentTranslation(
      PropertyCurrencyRow,
      'en',
      '#saveSystemCurrency',
      'Save',
    );
  });

  it('should render page in proper language', () => {
    testComponentTranslation(
      PropertyCurrencyRow,
      'pl',
      '#saveSystemCurrency',
      'Zapisz',
    );
  });
});
