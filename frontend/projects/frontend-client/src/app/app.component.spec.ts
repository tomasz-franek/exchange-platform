import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import Keycloak from 'keycloak-js';
import { MockKeycloak } from '../mocks/mock-keycloak';
import { KEYCLOAK_EVENT_SIGNAL } from 'keycloak-angular';
import { MOCK_KEYCLOAK_EVENT_SIGNAL } from '../mocks/mock-keycloak-signal';
import { ActivatedRoute } from '@angular/router';
import { mockRoute } from '../mocks/mock-activated-route';
import { FooterComponent } from 'shared-modules';
import { provideHttpClient } from '@angular/common/http';
import { AccountsStore } from './accounts/accounts.signal-store';
import { mockAccountsStore, mockPropertyStore } from '../mocks/mock-store';
import { PropertyStore } from './properties/properties.signal-store';
import { provideTranslateTestingService } from '../mocks/fake-translation-loader';
import assets_en from '../assets/i18n/en.json';
import assets_pl from '../assets/i18n/pl.json';

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AppComponent, FooterComponent],
      providers: [
        FormBuilder,
        ReactiveFormsModule,
        provideHttpClient(),
        { provide: Keycloak, useClass: MockKeycloak },
        {
          provide: KEYCLOAK_EVENT_SIGNAL,
          useValue: MOCK_KEYCLOAK_EVENT_SIGNAL,
        },
        { provide: ActivatedRoute, useValue: mockRoute },
        { provide: AccountsStore, useValue: mockAccountsStore },
        { provide: PropertyStore, useValue: mockPropertyStore },
        provideTranslateTestingService({
          en: assets_en,
          pl: assets_pl,
        }),
      ],
    }).compileComponents();
    fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the app', () => {
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it(`should have the 'frontend-client' title`, () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app.title).toEqual('frontend-client');
  });
});
