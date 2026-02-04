import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StatisticPair } from './statistic-pair';
import { MenuComponent } from '../../menu/menu.component';
import { testComponentTranslation } from '../../../mocks/test-functions';
import Keycloak from 'keycloak-js';
import { MockKeycloak } from '../../../mocks/mock-keycloak';
import { KEYCLOAK_EVENT_SIGNAL } from 'keycloak-angular';
import { MOCK_KEYCLOAK_EVENT_SIGNAL } from '../../../mocks/mock-keycloak-signal';
import { ActivatedRoute } from '@angular/router';
import { mockRoute } from '../../../mocks/activated-route-mock';
import {
  mockPropertyStore,
  mockStatisticStore,
} from '../../../mocks/mock-store';
import { StatisticStore } from '../statistics.signal-store';
import { PropertyStore } from '../../properties/properties.signal-store';
import { provideTranslateTestingService } from '../../../mocks/fake-translation-loader';
import assets_en from '../../../assets/i18n/en.json';
import assets_pl from '../../../assets/i18n/pl.json';

describe('StatisticPair', () => {
  let component: StatisticPair;
  let fixture: ComponentFixture<StatisticPair>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [StatisticPair, MenuComponent],
      providers: [
        { provide: Keycloak, useClass: MockKeycloak },
        { provide: PropertyStore, useValue: mockPropertyStore },
        {
          provide: KEYCLOAK_EVENT_SIGNAL,
          useValue: MOCK_KEYCLOAK_EVENT_SIGNAL,
        },
        { provide: StatisticStore, useValue: mockStatisticStore },
        { provide: ActivatedRoute, useValue: mockRoute },
        provideTranslateTestingService({
          en: assets_en,
          pl: assets_pl,
        }),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(StatisticPair);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render page in english (default)', () => {
    testComponentTranslation(
      StatisticPair,
      'en',
      '#amountSellEmptyLabel',
      'Amount sell tickets',
    );
  });

  it('should render page in proper language', () => {
    testComponentTranslation(
      StatisticPair,
      'pl',
      '#amountSellEmptyLabel',
      'Wartość zleceń sprzedaży',
    );
  });
});
