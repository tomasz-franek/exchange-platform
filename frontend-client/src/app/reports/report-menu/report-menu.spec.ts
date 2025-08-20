import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateService } from '@ngx-translate/core';
import { ReportMenu } from './report-menu';
import { ActivatedRoute } from '@angular/router';
import { mockRoute } from '../../../mocks/mock-activated-route';
import { checkMenuChecked, testTranslations } from '../../../mocks/test-functions';

describe('ReportMenu', () => {
  let component: ReportMenu;
  let fixture: ComponentFixture<ReportMenu>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        ReportMenu,
        testTranslations()
      ],
      providers: [{ provide: ActivatedRoute, useValue: mockRoute }]
    }).compileComponents();

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
    const idElement: HTMLElement = fixture.nativeElement.querySelector(
      '#labelReportFinancial'
    );
    expect(idElement.innerText).toContain('Financial report');
  });

  it('should render page in proper language', () => {
    const fixture = TestBed.createComponent(ReportMenu);

    const translateService = TestBed.inject(TranslateService);
    translateService.use('pl');

    fixture.detectChanges();
    const idElement: HTMLElement = fixture.nativeElement.querySelector(
      '#labelReportFinancial'
    );
    expect(idElement.innerText).toContain('Raport finansowy');
  });
  [{ id: 'reportFinancial', description: 'Report financial' }].forEach(
    ({ id, description }) => {
      it(`should check the menu option ${description} when clicked`, () => {
        checkMenuChecked(fixture, `#${id}`);
      });
    }
  );
});
