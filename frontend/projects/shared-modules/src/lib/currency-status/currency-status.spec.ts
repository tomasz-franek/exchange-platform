import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CurrencyStatus } from './currency-status';

describe('CurrencyStatus', () => {
  let component: CurrencyStatus;
  let fixture: ComponentFixture<CurrencyStatus>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CurrencyStatus],
    }).compileComponents();

    fixture = TestBed.createComponent(CurrencyStatus);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
