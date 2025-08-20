import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderBookTableComponent } from './order-book-table.component';
import { TranslateService } from '@ngx-translate/core';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { testTranslations } from '../../../mocks/test-functions';

describe('OrderBookTableComponent', () => {
  let component: OrderBookTableComponent;
  let fixture: ComponentFixture<OrderBookTableComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        OrderBookTableComponent,
        testTranslations()
      ],
      schemas: [NO_ERRORS_SCHEMA]
    });

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
    const idElement: HTMLElement = fixture.nativeElement.querySelector('#buyHeader');
    expect(idElement.innerText).toContain('Buy currency');
  });

  it('should render page in proper language', () => {
    const fixture = TestBed.createComponent(OrderBookTableComponent);

    const translateService = TestBed.inject(TranslateService);
    translateService.use('pl');

    fixture.detectChanges();
    const idElement: HTMLElement = fixture.nativeElement.querySelector('#buyHeader');
    expect(idElement.innerText).toContain('Kup walutę');
  });
});
