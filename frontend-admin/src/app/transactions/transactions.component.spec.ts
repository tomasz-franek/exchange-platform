import {ComponentFixture, TestBed} from '@angular/core/testing';

import {TransactionsComponent} from './transactions.component';
import {TranslateTestingModule} from "ngx-translate-testing";
import assets_en from "../../assets/i18n/en.json";
import assets_pl from "../../assets/i18n/pl.json";
import {ActivatedRoute} from "@angular/router";
import {mockRoute} from "../../mocks/activated-route-mock";
import {TranslateService} from "@ngx-translate/core";

describe('TransactionsComponent', () => {
  let component: TransactionsComponent;
  let fixture: ComponentFixture<TransactionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TransactionsComponent,
        TranslateTestingModule.withTranslations(
          'en',
          assets_en,
        ).withTranslations('pl', assets_pl),
      ],
      providers: [{provide: ActivatedRoute, useValue: mockRoute}],
    })
    .compileComponents();

    fixture = TestBed.createComponent(TransactionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render page in english (default)', () => {
    const translateService = TestBed.inject(TranslateService);
    translateService.setDefaultLang('en');
    const fixture = TestBed.createComponent(TransactionsComponent);

    fixture.detectChanges();
    const idElement: HTMLElement =
      fixture.nativeElement.querySelector('#labelTransactionList');
    expect(idElement.innerText).toContain('Transaction List');
  });

  it('should render page in proper language', () => {
    const fixture = TestBed.createComponent(TransactionsComponent);

    const translateService = TestBed.inject(TranslateService);
    translateService.use('pl');

    fixture.detectChanges();
    const idElement: HTMLElement =
      fixture.nativeElement.querySelector('#labelTransactionList');
    expect(idElement.innerText).toContain('Lista transakcji');
  });
});
