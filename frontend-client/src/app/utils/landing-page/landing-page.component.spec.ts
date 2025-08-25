import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LandingPageComponent } from './landing-page.component';
import { provideHttpClient } from '@angular/common/http';
import Keycloak from 'keycloak-js';
import { MockKeycloak } from '../../../mocks/mock-keycloak';
import { KEYCLOAK_EVENT_SIGNAL } from 'keycloak-angular';
import { MOCK_KEYCLOAK_EVENT_SIGNAL } from '../../../mocks/mock-keycloak-signal';
import { initialUtilState } from '../state/util.reducers';
import { provideMockStore } from '@ngrx/store/testing';
import {
  testComponentTranslation,
  testTranslations,
} from '../../../mocks/test-functions';

describe('LandingPageComponent', () => {
  let component: LandingPageComponent;
  let fixture: ComponentFixture<LandingPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LandingPageComponent, testTranslations()],
      providers: [
        provideHttpClient(),
        { provide: Keycloak, useClass: MockKeycloak },
        {
          provide: KEYCLOAK_EVENT_SIGNAL,
          useValue: MOCK_KEYCLOAK_EVENT_SIGNAL,
        },
        provideMockStore({ initialState: initialUtilState }),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(LandingPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should render page in english (default)', () => {
    testComponentTranslation(
      fixture,
      'en',
      '#welcome',
      'Welcome in the Exchange System',
    );
  });

  it('should render page in proper language', () => {
    testComponentTranslation(
      fixture,
      'pl',
      '#welcome',
      'Witamy w systemie wymiany walut',
    );
  });
});
