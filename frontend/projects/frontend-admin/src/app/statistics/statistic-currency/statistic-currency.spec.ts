import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StatisticCurrency } from './statistic-currency';
import { testComponentTranslation } from '../../../mocks/test-functions';
import { MenuComponent } from '../../menu/menu.component';
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

describe('StatisticCurrency', () => {
  let component: StatisticCurrency;
  let fixture: ComponentFixture<StatisticCurrency>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StatisticCurrency, MenuComponent],
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

    fixture = TestBed.createComponent(StatisticCurrency);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render page in english (default)', () => {
    testComponentTranslation(
      StatisticCurrency,
      'en',
      '#amountInTicketsEmptyLabel',
      'Amount in ticket',
    );
  });

  it('should render page in proper language', () => {
    testComponentTranslation(
      StatisticCurrency,
      'pl',
      '#amountInTicketsEmptyLabel',
      'Wartość w zleceniach',
    );
  });
});
