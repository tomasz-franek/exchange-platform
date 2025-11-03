import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PropertyCurrencyRow } from './property-currency-row';
import {
  testComponentTranslation,
  testTranslations,
} from '../../../mocks/test-functions';
import { provideMockStore } from '@ngrx/store/testing';
import { initialPropertyState } from '../state/properties.reducers';

describe('PropertyCurrencyRow', () => {
  let component: PropertyCurrencyRow;
  let fixture: ComponentFixture<PropertyCurrencyRow>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PropertyCurrencyRow, testTranslations()],
      providers: [provideMockStore({ initialState: initialPropertyState })],
    }).compileComponents();

    fixture = TestBed.createComponent(PropertyCurrencyRow);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render page in english (default)', () => {
    testComponentTranslation(fixture, 'en', '#saveSystemCurrency', 'Save');
  });

  it('should render page in proper language', () => {
    testComponentTranslation(fixture, 'pl', '#saveSystemCurrency', 'Zapisz');
  });
});
