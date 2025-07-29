import {ComponentFixture, TestBed} from '@angular/core/testing';

import {StatisticMenu} from './statistic-menu';
import {TranslateService} from "@ngx-translate/core";
import {TranslateTestingModule} from "ngx-translate-testing";
import assets_en from "../../../assets/i18n/en.json";
import assets_pl from "../../../assets/i18n/pl.json";

describe('StatisticMenu', () => {
  let component: StatisticMenu;
  let fixture: ComponentFixture<StatisticMenu>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StatisticMenu,
        TranslateTestingModule.withTranslations(
            'en',
            assets_en,
        ).withTranslations('pl', assets_pl),
      ],
    })
    .compileComponents();

    fixture = TestBed.createComponent(StatisticMenu);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render page in english (default)', () => {
    const translateService = TestBed.inject(TranslateService);
    translateService.setDefaultLang('en');
    const fixture = TestBed.createComponent(StatisticMenu);

    fixture.detectChanges();
    const idElement: HTMLElement =
        fixture.nativeElement.querySelector('#labelStatisticTransactions');
    expect(idElement.innerText).toContain('Transactions');
  });

  it('should render page in proper language', () => {
    const fixture = TestBed.createComponent(StatisticMenu);

    const translateService = TestBed.inject(TranslateService);
    translateService.use('pl');

    fixture.detectChanges();
    const idElement: HTMLElement =
        fixture.nativeElement.querySelector('#labelStatisticTransactions');
    expect(idElement.innerText).toContain('Transakcje');
  });
});
