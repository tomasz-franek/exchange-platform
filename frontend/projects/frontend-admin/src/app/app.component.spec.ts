import { TestBed } from '@angular/core/testing';
import { RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { provideHttpClient } from '@angular/common/http';
import Keycloak from 'keycloak-js';
import { MockKeycloak } from '../mocks/mock-keycloak';
import { KEYCLOAK_EVENT_SIGNAL } from 'keycloak-angular';
import { MOCK_KEYCLOAK_EVENT_SIGNAL } from '../mocks/mock-keycloak-signal';
import { PropertyStore } from './properties/properties.signal-store';
import { mockPropertyStore } from '../mocks/mock-store';
import { provideTranslateTestingService } from '../mocks/fake-translation-loader';
import assets_en from '../assets/i18n/en.json';
import assets_pl from '../assets/i18n/pl.json';

describe('AppComponent', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterModule.forRoot([]), AppComponent],
      providers: [
        provideHttpClient(),
        { provide: Keycloak, useClass: MockKeycloak },
        { provide: PropertyStore, useValue: mockPropertyStore },
        {
          provide: KEYCLOAK_EVENT_SIGNAL,
          useValue: MOCK_KEYCLOAK_EVENT_SIGNAL,
        },
        provideTranslateTestingService({
          en: assets_en,
          pl: assets_pl,
        }),
      ],
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
});
