import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderBookChartComponent } from './order-book-chart.component';
import { TranslateTestingModule } from 'ngx-translate-testing';
import assets_en from '../../../assets/i18n/en.json';
import assets_pl from '../../../assets/i18n/pl.json';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

describe('OrderBookChartComponent', () => {
  let component: OrderBookChartComponent;
  let fixture: ComponentFixture<OrderBookChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        OrderBookChartComponent,
        TranslateTestingModule.withTranslations(
          'en',
          assets_en
        ).withTranslations('pl', assets_pl)
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
