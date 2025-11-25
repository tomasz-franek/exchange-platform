import {ComponentFixture, TestBed} from '@angular/core/testing';

import {StatisticCurrency} from './statistic-currency';
import {testComponentTranslation, testTranslations,} from '../../../mocks/test-functions';
import {MenuComponent} from '../../menu/menu.component';
import Keycloak from 'keycloak-js';
import {MockKeycloak} from '../../../mocks/mock-keycloak';
import {KEYCLOAK_EVENT_SIGNAL} from 'keycloak-angular';
import {MOCK_KEYCLOAK_EVENT_SIGNAL} from '../../../mocks/mock-keycloak-signal';
import {ActivatedRoute} from '@angular/router';
import {mockRoute} from '../../../mocks/activated-route-mock';
import {mockStatisticStore} from '../../../mocks/mock-store';
import {StatisticStore} from '../statistics.signal-store';

describe('StatisticCurrency', () => {
  let component: StatisticCurrency;
  let fixture: ComponentFixture<StatisticCurrency>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StatisticCurrency, MenuComponent, testTranslations()],
      providers: [
        {provide: Keycloak, useClass: MockKeycloak},
        {
          provide: KEYCLOAK_EVENT_SIGNAL,
          useValue: MOCK_KEYCLOAK_EVENT_SIGNAL,
        },
        {provide: StatisticStore, useValue: mockStatisticStore},
        {provide: ActivatedRoute, useValue: mockRoute},
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
