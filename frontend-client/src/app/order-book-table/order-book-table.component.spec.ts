import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderBookTableComponent } from './order-book-table.component';
import { TranslateTestingModule } from 'ngx-translate-testing';
import assets_en from '../../assets/i18n/en.json';
import assets_pl from '../../assets/i18n/pl.json';
import { TranslateService } from '@ngx-translate/core';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('OrderBookTableComponent', () => {
  let component: OrderBookTableComponent;
  let fixture: ComponentFixture<OrderBookTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        OrderBookTableComponent,
        TranslateTestingModule.withTranslations(
          'en',
          assets_en,
        ).withTranslations('pl', assets_pl),
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(OrderBookTableComponent);
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
