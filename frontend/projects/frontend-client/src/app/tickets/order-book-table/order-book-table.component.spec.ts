import {ComponentFixture, TestBed} from '@angular/core/testing';

import {OrderBookTableComponent} from './order-book-table.component';
import {NO_ERRORS_SCHEMA} from '@angular/core';
import {testComponentTranslation, testTranslations,} from '../../../mocks/test-functions';

describe('OrderBookTableComponent', () => {
  let component: OrderBookTableComponent;
  let fixture: ComponentFixture<OrderBookTableComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [OrderBookTableComponent, testTranslations()],
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
    testComponentTranslation(OrderBookTableComponent, 'en', '#buyHeader', 'Buy currency');
  });

  it('should render page in proper language', () => {
    testComponentTranslation(OrderBookTableComponent, 'pl', '#buyHeader', 'Kup walutę');
  });
});
