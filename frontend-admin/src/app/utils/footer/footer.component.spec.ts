import {ComponentFixture, TestBed} from '@angular/core/testing';

import {FooterComponent} from './footer.component';
import {TranslateTestingModule} from 'ngx-translate-testing';
import assets_en from '../../../assets/i18n/en.json';
import assets_pl from '../../../assets/i18n/pl.json';
import {NO_ERRORS_SCHEMA} from '@angular/core';
import {provideMockStore} from '@ngrx/store/testing';
import {initialUtilState} from '../state/util.reducers';
import {TranslateService} from '@ngx-translate/core';

describe('FooterComponent', () => {
  let component: FooterComponent;
  let fixture: ComponentFixture<FooterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        FooterComponent,
        TranslateTestingModule.withTranslations(
          'en',
          assets_en,
        ).withTranslations('pl', assets_pl),
      ],
      providers: [
        provideMockStore({initialState: initialUtilState}),
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(FooterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render page in english (default)', () => {
    const translateService = TestBed.inject(TranslateService);
    translateService.setDefaultLang('en');
    const fixture = TestBed.createComponent(FooterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    const tdElement: HTMLElement =
      fixture.nativeElement.querySelector('#name');
    expect(tdElement.innerText).toContain('Admin Exchange Platform');
  });

  it('should render page in proper language', () => {
    const fixture = TestBed.createComponent(FooterComponent);
    component = fixture.componentInstance;

    const translateService = TestBed.inject(TranslateService);
    translateService.use('pl');

    fixture.detectChanges();
    const tdElement: HTMLElement =
      fixture.nativeElement.querySelector('#name');
    expect(tdElement.innerText).toContain('Administracja platformy wymiany');
  });
});
