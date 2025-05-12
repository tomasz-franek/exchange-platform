import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderBookChartComponent } from './order-book-chart.component';

describe('OrderBookComponent', () => {
  let component: OrderBookChartComponent;
  let fixture: ComponentFixture<OrderBookChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrderBookChartComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(OrderBookChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
