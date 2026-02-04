import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RateList } from './rate-list';
import { testComponentTranslation } from '../../../mocks/test-functions';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import Keycloak from 'keycloak-js';
import { MockKeycloak } from '../../../mocks/mock-keycloak';
import { KEYCLOAK_EVENT_SIGNAL } from 'keycloak-angular';
import { MOCK_KEYCLOAK_EVENT_SIGNAL } from '../../../mocks/mock-keycloak-signal';
import { ActivatedRoute } from '@angular/router';
import { mockRoute } from '../../../mocks/mock-activated-route';
import { RatesStore } from '../rates.signal-store';
import { mockPropertyStore, mockRatesStore } from '../../../mocks/mock-store';
import { PropertyStore } from '../../properties/properties.signal-store';
import { provideTranslateTestingService } from '../../../mocks/fake-translation-loader';
import assets_en from '../../../assets/i18n/en.json';
import assets_pl from '../../../assets/i18n/pl.json';

describe('RateList', () => {
  let component: RateList;
  let fixture: ComponentFixture<RateList>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RateList],
      providers: [
        FormBuilder,
        ReactiveFormsModule,
        { provide: RatesStore, useValue: mockRatesStore },
        { provide: PropertyStore, useValue: mockPropertyStore },
        { provide: Keycloak, useClass: MockKeycloak },
        {
          provide: KEYCLOAK_EVENT_SIGNAL,
          useValue: MOCK_KEYCLOAK_EVENT_SIGNAL,
        },
        { provide: ActivatedRoute, useValue: mockRoute },
        provideTranslateTestingService({
          en: assets_en,
          pl: assets_pl,
        }),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(RateList);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render page in english (default)', () => {
    testComponentTranslation(RateList, 'en', '#rateList', 'List rates');
  });

  it('should render page in proper language', () => {
    testComponentTranslation(RateList, 'pl', '#rateList', 'List kursów');
  });
});
