import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PropertySystem } from './property-system';
import { testComponentTranslation } from '../../../mocks/test-functions';
import { ActivatedRoute } from '@angular/router';
import { mockRoute } from '../../../mocks/activated-route-mock';
import Keycloak from 'keycloak-js';
import { MockKeycloak } from '../../../mocks/mock-keycloak';
import { KEYCLOAK_EVENT_SIGNAL } from 'keycloak-angular';
import { MOCK_KEYCLOAK_EVENT_SIGNAL } from '../../../mocks/mock-keycloak-signal';
import { mockPropertyStore } from '../../../mocks/mock-store';
import { PropertyStore } from '../properties.signal-store';
import { provideTranslateTestingService } from '../../../mocks/fake-translation-loader';
import assets_en from '../../../assets/i18n/en.json';
import assets_pl from '../../../assets/i18n/pl.json';

describe('PropertySystem', () => {
  let component: PropertySystem;
  let fixture: ComponentFixture<PropertySystem>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [PropertySystem],
      providers: [
        { provide: ActivatedRoute, useValue: mockRoute },
        { provide: PropertyStore, useValue: mockPropertyStore },
        { provide: Keycloak, useClass: MockKeycloak },
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

    fixture = TestBed.createComponent(PropertySystem);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render page in english (default)', () => {
    testComponentTranslation(
      PropertySystem,
      'en',
      '#ratioStrategyEmpty',
      'Ratio strategy',
    );
  });

  it('should render page in proper language', () => {
    testComponentTranslation(
      PropertySystem,
      'pl',
      '#ratioStrategyEmpty',
      'Strategia kursu wymiany',
    );
  });
});
