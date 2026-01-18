import {ComponentFixture, TestBed} from '@angular/core/testing';
import {CurrencyStatus} from './currency-status';
import {By} from '@angular/platform-browser';

describe('CurrencyStatus', () => {
  let component: CurrencyStatus;
  let fixture: ComponentFixture<CurrencyStatus>;
  let compiled: HTMLElement;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CurrencyStatus],
    }).compileComponents();

    fixture = TestBed.createComponent(CurrencyStatus);
    component = fixture.componentInstance;
    compiled = fixture.nativeElement as HTMLElement;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with default values', () => {
    expect(component.pair()).toBe('');
    expect(component.currency()).toBe('');
    expect(component.buy()).toBe(0);
    expect(component.sell()).toBe(0);
    expect(component.totalValue).toBe(0);
    expect(component.valueArray).toEqual([
      { label: 'BUY', color: '#34d399', value: 0 },
      { label: 'SELL', color: '#fb2444', value: 0 },
    ]);
  });

  it('should update valueArray and totalValue on changes', () => {
    component.ngOnChanges({
      buy: { currentValue: 100, previousValue: 0, firstChange: false },
      sell: { currentValue: 200, previousValue: 0, firstChange: false },
      pair: { currentValue: 'USD/EUR', previousValue: '', firstChange: false },
      currency: { currentValue: 'USD', previousValue: '', firstChange: false },
    } as any);

    expect(component.valueArray[0].value).toBe(100);
    expect(component.valueArray[1].value).toBe(200);
    expect(component.totalValue).toBe(300);
    expect(component.pair()).toBe('USD/EUR');
    expect(component.currency()).toBe('USD');
  });

  it('should reflect changes in the template', () => {
    component.ngOnChanges({
      buy: { currentValue: 150, previousValue: 0, firstChange: true },
      sell: { currentValue: 250, previousValue: 0, firstChange: true },
      pair: { currentValue: 'GBP/USD', previousValue: '', firstChange: true },
      currency: { currentValue: 'GBP', previousValue: '', firstChange: true },
    } as any);

    fixture.detectChanges(false);

    const buyText = fixture.debugElement.query(By.css('th')).nativeElement
      .textContent;
    expect(buyText).toContain('BUY 150 GBP');

    const sellText = fixture.debugElement.query(By.css('th:nth-child(2)'))
      .nativeElement.textContent;
    expect(sellText).toContain('SELL 250 GBP');
  });

  it('should handle undefined inputs gracefully', () => {
    component.buy();
    component.sell();
    component.ngOnChanges({} as any);

    expect(component.valueArray[0].value).toBe(0);
    expect(component.valueArray[1].value).toBe(0);
    expect(component.totalValue).toBe(0);
  });

  it('should present zeroes when both sides are 0 amount', async () => {
    component.ngOnChanges({
      buy: { currentValue: 0, previousValue: 0, firstChange: true },
      sell: { currentValue: 0, previousValue: 0, firstChange: true },
      pair: { currentValue: 'GBP/USD', previousValue: '', firstChange: true },
      currency: { currentValue: 'GBP', previousValue: '', firstChange: true },
    } as any);

    fixture.detectChanges(false);
    const buyText = fixture.debugElement.query(By.css('th')).nativeElement
      .textContent;
    expect(buyText).toContain('BUY 0 GBP');

    const sellText = fixture.debugElement.query(By.css('th:nth-child(2)'))
      .nativeElement.textContent;
    expect(sellText).toContain('SELL 0 GBP');
  });
});
