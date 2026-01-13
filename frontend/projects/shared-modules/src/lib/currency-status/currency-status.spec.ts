import {ComponentFixture, TestBed} from '@angular/core/testing';
import {CurrencyStatus} from './currency-status';

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
    expect(component.pair).toBe('');
    expect(component.currency).toBe('');
    expect(component.buy).toBe(0);
    expect(component.sell).toBe(0);
    expect(component.totalValue).toBe(0);
    expect(component.valueArray).toEqual([
      { label: 'BUY', color: '#34d399', value: 0 },
      { label: 'SELL', color: '#fb2444', value: 0 },
    ]);
  });

  it('should update valueArray and totalValue on changes', () => {
    component.ngOnChanges({
      buy: { currentValue: 100, previousValue: 0, firstChange: true },
      sell: { currentValue: 200, previousValue: 0, firstChange: true },
      pair: { currentValue: 'USD/EUR', previousValue: '', firstChange: true },
      currency: { currentValue: 'USD', previousValue: '', firstChange: true },
    } as any);

    expect(component.valueArray[0].value).toBe(100);
    expect(component.valueArray[1].value).toBe(200);
    expect(component.totalValue).toBe(300);
    expect(component.pair).toBe('USD/EUR');
    expect(component.currency).toBe('USD');
  });

  it('should reflect changes in the template', () => {
    component.ngOnChanges({
      buy: { currentValue: 150, previousValue: 0, firstChange: true },
      sell: { currentValue: 250, previousValue: 0, firstChange: true },
      pair: { currentValue: 'GBP/USD', previousValue: '', firstChange: true },
      currency: { currentValue: 'GBP', previousValue: '', firstChange: true },
    } as any);

    fixture.detectChanges();

    const buyText = compiled.querySelector('th');
    expect(buyText).toContain('BUY 150 GBP');

    const sellText = compiled.querySelector('th:nth-child(2)');
    expect(sellText).toContain('SELL 250 GBP');
  });

  it('should handle undefined inputs gracefully', () => {
    component.buy = undefined;
    component.sell = undefined;
    component.ngOnChanges({} as any);

    expect(component.valueArray[0].value).toBe(0);
    expect(component.valueArray[1].value).toBe(0);
    expect(component.totalValue).toBe(0);
  });

  it('should present zeroes when both sides are 0 amount', () => {
    console.log('1');
    component.ngOnChanges({
      buy: { currentValue: 0, previousValue: 0, firstChange: false },
      sell: { currentValue: 0, previousValue: 0, firstChange: false },
      pair: { currentValue: 'GBP/USD', previousValue: '', firstChange: false },
      currency: { currentValue: 'GBP', previousValue: '', firstChange: false },
    } as any);
    console.log('2');
    fixture.detectChanges();
    console.log('3');
    const buyText = compiled.querySelector('th');
    console.log('4');
    expect(buyText).toContain('BUY 0 GBP');
    console.log('1');

    const sellText = compiled.querySelector('th:nth-child(2)');
    console.log('1');
    console.log(sellText);
    expect(sellText).toContain('SELL 0 GBP');
  });
});
