import { TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { provideMockStore } from '@ngrx/store/testing';
import { provideToastr } from 'ngx-toastr';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import Keycloak from 'keycloak-js';
import { MockKeycloak } from '../mocks/mock-keycloak';
import { KEYCLOAK_EVENT_SIGNAL } from 'keycloak-angular';
import { MOCK_KEYCLOAK_EVENT_SIGNAL } from '../mocks/mock-keycloak-signal';
import { ActivatedRoute } from '@angular/router';
import { mockRoute } from '../mocks/mock-activated-route';
import { initialAccountState } from './accounts/state/account.reducers';
import { FooterComponent } from './utils/footer/footer.component';
import { provideHttpClient } from '@angular/common/http';
import { TranslateService } from '@ngx-translate/core';
import { testTranslations } from '../mocks/test-functions';

describe('AppComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        AppComponent,
        FooterComponent,
        testTranslations()
      ],
      providers: [
        FormBuilder,
        ReactiveFormsModule,
        provideMockStore({}),
        provideHttpClient(),
        provideToastr(),
        { provide: Keycloak, useClass: MockKeycloak },
        {
          provide: KEYCLOAK_EVENT_SIGNAL,
          useValue: MOCK_KEYCLOAK_EVENT_SIGNAL
        },
        { provide: ActivatedRoute, useValue: mockRoute },
        provideMockStore({ initialState: initialAccountState })
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it(`should have the 'frontend-client' title`, () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app.title).toEqual('frontend-client');
  });

  it('should render page in english (default)', () => {
    const translateService = TestBed.inject(TranslateService);
    translateService.setDefaultLang('en');
    const fixture = TestBed.createComponent(AppComponent);

    fixture.detectChanges();
    const idElement: HTMLElement =
      fixture.nativeElement.querySelector('#versionEmpty');
    expect(idElement.innerText).toContain('Version number : -');
  });

  it('should render page in proper language', () => {
    const fixture = TestBed.createComponent(AppComponent);

    const translateService = TestBed.inject(TranslateService);
    translateService.use('pl');

    fixture.detectChanges();
    const idElement: HTMLElement =
      fixture.nativeElement.querySelector('#versionEmpty');
    expect(idElement.innerText).toContain('Numer wersji : -');
  });
});
