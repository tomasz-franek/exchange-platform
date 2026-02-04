import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA, SimpleChange, SimpleChanges } from '@angular/core';
import { RatioRange } from './ratio-range';
import { provideTranslateTestingService } from '../../../../frontend-client/src/mocks/fake-translation-loader';
import assets_en from '../../assets/i18n/en.json';
import assets_pl from '../../assets/i18n/pl.json';

describe('RatioRange Component', () => {
  let component: RatioRange;
  let fixture: ComponentFixture<RatioRange>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RatioRange],
      providers: [
        provideTranslateTestingService({
          en: assets_en,
          pl: assets_pl,
        }),
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RatioRange);
    component = fixture.componentInstance;
    const changes: SimpleChanges = {
      lowRatio: new SimpleChange(0, 10, false),
      currentRatio: new SimpleChange(0, 50, false),
      highRatio: new SimpleChange(0, 100, false),
      pair: new SimpleChange('', 'Test Pair', false),
    };
    component.ngOnChanges(changes);
    fixture.detectChanges();
  });

  it('should create the RatioRange component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize ranges correctly', () => {
    expect(component.ranges.length).toBe(2);
    expect(component.ranges[0].value).toBe(50);
    expect(component.ranges[1].value).toBe(100);
    expect(component.pair).toBe('Test Pair');
  });

  it('should update ranges and lowRatio on ngOnChanges', () => {
    const changes: SimpleChanges = {
      lowRatio: new SimpleChange(10, 15, false),
      currentRatio: new SimpleChange(50, 75, false),
      highRatio: new SimpleChange(100, 120, false),
      pair: new SimpleChange('', 'Test Pair New', false),
    };

    component.ngOnChanges(changes);

    expect(component.ranges[0].value).toBe(75);
    expect(component.ranges[1].value).toBe(120);
    expect(component.lowRatio).toBe(15);
    expect(component.currentRatio).toBe(75);
    expect(component.highRatio).toBe(120);
    expect(component.pair).toBe('Test Pair New');
  });

  it('should render the correct title', () => {
    const titleElem = fixture.nativeElement.querySelector('.start');
    expect(titleElem.textContent).toContain('Test Pair');
  });

  it('should render the correct low, current, and high ratio values', () => {
    const span = fixture.nativeElement.querySelector('span');
    const lastRow = fixture.nativeElement.querySelector('table tr:last-child');
    const lowElem = lastRow.querySelector('table th:first-child');
    const currentElem = lastRow.querySelector('table th:nth-child(2)');
    const highElem = lastRow.querySelector('table th:last-child');

    expect(lowElem.textContent).toContain('10');
    expect(currentElem.textContent).toContain('50');
    expect(highElem.textContent).toContain('100');
    expect(span.textContent).toContain('Test Pair');
  });

  it('should update values', () => {
    const changes: SimpleChanges = {
      lowRatio: new SimpleChange(10, 15, false),
      currentRatio: new SimpleChange(50, 75, false),
      highRatio: new SimpleChange(100, 120, false),
      pair: new SimpleChange('', 'Test Pair New', false),
    };

    component.ngOnChanges(changes);
    fixture.detectChanges();

    const span = fixture.nativeElement.querySelector('span');
    const lastRow = fixture.nativeElement.querySelector('table tr:last-child');
    const lowElem = lastRow.querySelector('table th:first-child');
    const currentElem = lastRow.querySelector('table th:nth-child(2)');
    const highElem = lastRow.querySelector('table th:last-child');

    expect(lowElem.textContent).toContain('15');
    expect(currentElem.textContent).toContain('75');
    expect(highElem.textContent).toContain('120');
    expect(span.textContent).toContain('Test Pair New');
  });
});
