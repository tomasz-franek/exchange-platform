import {ComponentFixture, TestBed} from '@angular/core/testing';

import {ReportMenu} from './report-menu';
import {TranslateService} from "@ngx-translate/core";
import {TranslateTestingModule} from "ngx-translate-testing";
import assets_en from "../../../assets/i18n/en.json";
import assets_pl from "../../../assets/i18n/pl.json";
import {ActivatedRoute} from "@angular/router";
import {mockRoute} from "../../../mocks/activated-route-mock";
import {By} from '@angular/platform-browser';

describe('ReportMenu', () => {
  let component: ReportMenu;
  let fixture: ComponentFixture<ReportMenu>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        ReportMenu,
        TranslateTestingModule.withTranslations(
          'en',
          assets_en,
        ).withTranslations('pl', assets_pl),
      ],
      providers: [{provide: ActivatedRoute, useValue: mockRoute}],
    })
      .compileComponents();

    fixture = TestBed.createComponent(ReportMenu);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render page in english (default)', () => {
    const translateService = TestBed.inject(TranslateService);
    translateService.setDefaultLang('en');
    const fixture = TestBed.createComponent(ReportMenu);

    fixture.detectChanges();
    const idElement: HTMLElement =
      fixture.nativeElement.querySelector('#labelReportTransactions');
    expect(idElement.innerText).toContain('Transaction List');
  });

  it('should render page in proper language', () => {
    const fixture = TestBed.createComponent(ReportMenu);

    const translateService = TestBed.inject(TranslateService);
    translateService.use('pl');

    fixture.detectChanges();
    const idElement: HTMLElement =
      fixture.nativeElement.querySelector('#labelReportTransactions');
    expect(idElement.innerText).toContain('Lista transakcji');
  });

  [
    {id: 'reportTransactionList', description: 'Report Transaction List'},
  ].forEach(({id, description}) => {
    it(`should check the menu option ${description} when clicked`, () => {
      const radioButton = fixture.debugElement.query(By.css(`#${id}`));
      radioButton.nativeElement.click();
      fixture.detectChanges();

      const isChecked = (document.getElementById(id) as HTMLInputElement).checked;
      expect(isChecked).toBeTrue();
    });
  });
});
