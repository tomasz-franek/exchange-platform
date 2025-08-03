import {ComponentFixture, TestBed} from '@angular/core/testing';

import {MonitoringComponent} from './monitoring.component';
import {TranslateService} from "@ngx-translate/core";
import {TranslateTestingModule} from "ngx-translate-testing";
import assets_en from "../../assets/i18n/en.json";
import assets_pl from "../../assets/i18n/pl.json";

describe('MonitoringComponent', () => {
  let component: MonitoringComponent;
  let fixture: ComponentFixture<MonitoringComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MonitoringComponent,
        TranslateTestingModule.withTranslations(
          'en',
          assets_en,
        ).withTranslations('pl', assets_pl),
      ],
    })
    .compileComponents();

    fixture = TestBed.createComponent(MonitoringComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render page in english (default)', () => {
    const translateService = TestBed.inject(TranslateService);
    translateService.setDefaultLang('en');
    const fixture = TestBed.createComponent(MonitoringComponent);

    fixture.detectChanges();
    const idElement: HTMLElement =
      fixture.nativeElement.querySelector('#labelStatisticTransactions');
    expect(idElement.innerText).toContain('Transactions');
  });

  it('should render page in proper language', () => {
    const fixture = TestBed.createComponent(MonitoringComponent);

    const translateService = TestBed.inject(TranslateService);
    translateService.use('pl');

    fixture.detectChanges();
    const idElement: HTMLElement =
      fixture.nativeElement.querySelector('#labelStatisticTransactions');
    expect(idElement.innerText).toContain('Transakcje');
  });
});
