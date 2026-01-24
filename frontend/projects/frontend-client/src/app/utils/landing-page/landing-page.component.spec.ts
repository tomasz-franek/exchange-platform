import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LandingPageComponent } from './landing-page.component';
import { provideHttpClient } from '@angular/common/http';
import Keycloak from 'keycloak-js';
import { MockKeycloak } from '../../../mocks/mock-keycloak';
import { KEYCLOAK_EVENT_SIGNAL } from 'keycloak-angular';
import { MOCK_KEYCLOAK_EVENT_SIGNAL } from '../../../mocks/mock-keycloak-signal';
import { testComponentTranslation } from '../../../mocks/test-functions';
import { Router } from '@angular/router';
import { UtilStore } from '../utils.signal-store';
import { mockUtilsStore } from '../../../mocks/mock-store';
import { provideTranslateTestingService } from '../../../mocks/fake-translation-loader';
import assets_en from '../../../assets/i18n/en.json';
import assets_pl from '../../../assets/i18n/pl.json';

describe('LandingPageComponent', () => {
  let component: LandingPageComponent;
  let fixture: ComponentFixture<LandingPageComponent>;
  let router: Router;

  beforeEach(async () => {
    const routerMock = {
      navigate: jasmine.createSpy('navigate'),
    };

    await TestBed.configureTestingModule({
      imports: [LandingPageComponent],
      providers: [
        provideHttpClient(),
        { provide: Keycloak, useClass: MockKeycloak },
        {
          provide: KEYCLOAK_EVENT_SIGNAL,
          useValue: MOCK_KEYCLOAK_EVENT_SIGNAL,
        },
        { provide: UtilStore, useValue: mockUtilsStore },
        { provide: Router, useValue: routerMock },
        provideTranslateTestingService({
          en: assets_en,
          pl: assets_pl,
        }),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(LandingPageComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should render page in english (default)', () => {
    testComponentTranslation(
      LandingPageComponent,
      'en',
      '#welcome',
      'Welcome in the Exchange System',
    );
  });

  it('should render page in proper language', () => {
    testComponentTranslation(
      LandingPageComponent,
      'pl',
      '#welcome',
      'Witamy w systemie wymiany walut',
    );
  });

  it('should navigate to dashboard on calling navigateToLogin', () => {
    component.navigateToLogin();
    expect(router.navigate).toHaveBeenCalledWith(['dashboard']);
  });

  it('should render page in english (default)', () => {
    testComponentTranslation(
      LandingPageComponent,
      'en',
      '#version',
      'Version number : ',
    );
  });

  it('should render page in proper language', () => {
    testComponentTranslation(
      LandingPageComponent,
      'pl',
      '#version',
      'Numer wersji : ',
    );
  });
});
