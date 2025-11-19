import {ComponentFixture, TestBed} from '@angular/core/testing';

import {PropertyCurrencyRow} from './property-currency-row';
import {testComponentTranslation, testTranslations,} from '../../../mocks/test-functions';
import {propertyStore} from '../properties.signal-store';
import {mockPropertyStore} from '../../../mocks/mock-store';

describe('PropertyCurrencyRow', () => {
  let component: PropertyCurrencyRow;
  let fixture: ComponentFixture<PropertyCurrencyRow>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PropertyCurrencyRow, testTranslations()],
      providers: [{provide: propertyStore, useValue: mockPropertyStore},],
    }).compileComponents();

    fixture = TestBed.createComponent(PropertyCurrencyRow);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render page in english (default)', () => {
    testComponentTranslation(PropertyCurrencyRow, 'en', '#saveSystemCurrency', 'Save');
  });

  it('should render page in proper language', () => {
    testComponentTranslation(PropertyCurrencyRow, 'pl', '#saveSystemCurrency', 'Zapisz');
  });
});
