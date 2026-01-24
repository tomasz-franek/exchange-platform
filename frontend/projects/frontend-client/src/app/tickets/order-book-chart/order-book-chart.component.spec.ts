import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderBookChartComponent } from './order-book-chart.component';
import { testComponentTranslation } from '../../../mocks/test-functions';
import { provideTranslateTestingService } from '../../../mocks/fake-translation-loader';
import assets_en from '../../../assets/i18n/en.json';
import assets_pl from '../../../assets/i18n/pl.json';

describe('OrderBookChartComponent', () => {
  let component: OrderBookChartComponent;
  let fixture: ComponentFixture<OrderBookChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrderBookChartComponent],
      providers: [
        provideTranslateTestingService({
          en: assets_en,
          pl: assets_pl,
        }),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(OrderBookChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render page in english (default)', () => {
    testComponentTranslation(
      OrderBookChartComponent,
      'en',
      '#chartHeader',
      'Order Book',
    );
  });

  it('should render page in proper language', () => {
    testComponentTranslation(
      OrderBookChartComponent,
      'pl',
      '#chartHeader',
      'Lista zleceń',
    );
  });
});
