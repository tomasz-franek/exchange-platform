import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderBookChartComponent } from './order-book-chart.component';
import { TranslateService } from '@ngx-translate/core';
import {
  testComponentTranslation,
  testTranslations,
} from '../../../mocks/test-functions';

describe('OrderBookChartComponent', () => {
  let component: OrderBookChartComponent;
  let fixture: ComponentFixture<OrderBookChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrderBookChartComponent, testTranslations()],
    }).compileComponents();

    fixture = TestBed.createComponent(OrderBookChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render page in english (default)', () => {
    testComponentTranslation(fixture, 'en', '#chartHeader', 'Order Book');
  });

  it('should render page in proper language', () => {
    testComponentTranslation(fixture, 'pl', '#chartHeader', 'Lista zleceń');
  });
});
