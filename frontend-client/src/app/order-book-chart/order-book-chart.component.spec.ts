import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderBookChartComponent } from './order-book-chart.component';
import { TranslateService } from '@ngx-translate/core';
import { OrderBookTableComponent } from '../order-book-table/order-book-table.component';
import { TranslateTestingModule } from 'ngx-translate-testing';
import assets_en from '../../assets/i18n/en.json';
import assets_pl from '../../assets/i18n/pl.json';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('OrderBookComponent', () => {
  let component: OrderBookChartComponent;
  let fixture: ComponentFixture<OrderBookChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        OrderBookChartComponent,
        TranslateTestingModule.withTranslations(
          'en',
          assets_en,
        ).withTranslations('pl', assets_pl),
      ],
      schemas: [NO_ERRORS_SCHEMA],
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
    const fixture = TestBed.createComponent(OrderBookTableComponent);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('label')?.textContent).toContain('Normal');
  });

  it('should render page in proper language', () => {
    const fixture = TestBed.createComponent(OrderBookTableComponent);

    const translateService = TestBed.inject(TranslateService);
    translateService.use('pl');

    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('label')?.textContent).toContain('Normalny');
  });
});
