import {TestBed} from '@angular/core/testing';
import {RouterModule} from '@angular/router';
import {AppComponent} from './app.component';
import {TranslateTestingModule} from 'ngx-translate-testing';
import assets_en from '../assets/i18n/en.json';
import assets_pl from '../assets/i18n/pl.json';
import {provideHttpClient} from "@angular/common/http";
import {TranslateService} from "@ngx-translate/core";
import Keycloak from "keycloak-js";
import {MockKeycloak} from "../mocks/mock-keycloak";
import {KEYCLOAK_EVENT_SIGNAL} from "keycloak-angular";
import {MOCK_KEYCLOAK_EVENT_SIGNAL} from "../mocks/mock-keycloak-signal";

describe('AppComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RouterModule.forRoot([]),
        AppComponent,
        TranslateTestingModule.withTranslations(
          'en',
          assets_en,
        ).withTranslations('pl', assets_pl),
      ],
      providers: [provideHttpClient(), {provide: Keycloak, useClass: MockKeycloak},
        {
          provide: KEYCLOAK_EVENT_SIGNAL,
          useValue: MOCK_KEYCLOAK_EVENT_SIGNAL,
        },]
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it(`should have as title 'frontend-admin'`, () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app.title).toEqual('frontend-admin');
  });

  it('should render page in english (default)', () => {
    const translateService = TestBed.inject(TranslateService);
    translateService.setDefaultLang('en');
    const fixture = TestBed.createComponent(AppComponent);

    fixture.detectChanges();
    const idElement: HTMLElement =
      fixture.nativeElement.querySelector('#accountsLabel');
    expect(idElement.innerText).toContain('Accounts');
  });

  it('should render page in proper language', () => {
    const fixture = TestBed.createComponent(AppComponent);

    const translateService = TestBed.inject(TranslateService);
    translateService.use('pl');

    fixture.detectChanges();
    const idElement: HTMLElement =
      fixture.nativeElement.querySelector('#accountsLabel');
    expect(idElement.innerText).toContain('Konta');
  });
});
