import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderBookChartComponent } from './order-book-chart.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { testTranslations } from '../../../mocks/test-functions';

describe('OrderBookChartComponent', () => {
  let component: OrderBookChartComponent;
  let fixture: ComponentFixture<OrderBookChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        OrderBookChartComponent,
        testTranslations()
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(OrderBookChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render page in english (default)', () => {
    const translateService = TestBed.inject(TranslateService);
    translateService.setDefaultLang('en');
    const fixture = TestBed.createComponent(OrderBookChartComponent);
    fixture.detectChanges();
    const idElement: HTMLElement = fixture.nativeElement.querySelector('#chartHeader');
    expect(idElement.innerText).toContain('Order Book');
  });

  it('should render page in proper language', () => {
    const fixture = TestBed.createComponent(OrderBookChartComponent);

    const translateService = TestBed.inject(TranslateService);
    translateService.use('pl');

    fixture.detectChanges();
    const idElement: HTMLElement = fixture.nativeElement.querySelector('#chartHeader');
    expect(idElement.innerText).toContain('Lista zleceń');
  });
});
