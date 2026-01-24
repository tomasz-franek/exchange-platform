import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderBookTableComponent } from './order-book-table.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { testComponentTranslation } from '../../../mocks/test-functions';
import { PropertyStore } from '../../properties/properties.signal-store';
import { mockPropertyStore } from '../../../mocks/mock-store';
import { provideTranslateTestingService } from '../../../mocks/fake-translation-loader';
import assets_en from '../../../assets/i18n/en.json';
import assets_pl from '../../../assets/i18n/pl.json';

describe('OrderBookTableComponent', () => {
  let component: OrderBookTableComponent;
  let fixture: ComponentFixture<OrderBookTableComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [OrderBookTableComponent],
      providers: [
        { provide: PropertyStore, useValue: mockPropertyStore },
        provideTranslateTestingService({
          en: assets_en,
          pl: assets_pl,
        }),
      ],
      schemas: [NO_ERRORS_SCHEMA],
    });

    fixture = TestBed.createComponent(OrderBookTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render page in english (default)', () => {
    testComponentTranslation(
      OrderBookTableComponent,
      'en',
      '#buyHeader',
      'Buy currency',
    );
  });

  it('should render page in proper language', () => {
    testComponentTranslation(
      OrderBookTableComponent,
      'pl',
      '#buyHeader',
      'Kup walutę',
    );
  });
});
