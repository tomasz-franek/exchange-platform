import {ComponentFixture, TestBed} from '@angular/core/testing';

import {ForbiddenComponent} from './forbidden.component';
import {TranslateService} from "@ngx-translate/core";
import {TranslateTestingModule} from "ngx-translate-testing";
import assets_en from "../../assets/i18n/en.json";
import assets_pl from "../../assets/i18n/pl.json";

describe('ForbiddenComponent', () => {
  let component: ForbiddenComponent;
  let fixture: ComponentFixture<ForbiddenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ForbiddenComponent,
        TranslateTestingModule.withTranslations(
            'en',
            assets_en,
        ).withTranslations('pl', assets_pl),
      ],
    })
    .compileComponents();

    fixture = TestBed.createComponent(ForbiddenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render page in english (default)', () => {
    const translateService = TestBed.inject(TranslateService);
    translateService.setDefaultLang('en');
    const fixture = TestBed.createComponent(ForbiddenComponent);

    fixture.detectChanges();
    const idElement: HTMLElement =
        fixture.nativeElement.querySelector('#forbidden');
    expect(idElement.innerText).toContain('403 - Forbidden.');
  });

  it('should render page in proper language', () => {
    const fixture = TestBed.createComponent(ForbiddenComponent);

    const translateService = TestBed.inject(TranslateService);
    translateService.use('pl');

    fixture.detectChanges();
    const idElement: HTMLElement =
        fixture.nativeElement.querySelector('#forbidden');
    expect(idElement.innerText).toContain('403 - Brak dostępu.');
  });
});
