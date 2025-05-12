import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderBookTableComponent } from './order-book-table.component';

describe('OrderBookTableComponent', () => {
  let component: OrderBookTableComponent;
  let fixture: ComponentFixture<OrderBookTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrderBookTableComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(OrderBookTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
