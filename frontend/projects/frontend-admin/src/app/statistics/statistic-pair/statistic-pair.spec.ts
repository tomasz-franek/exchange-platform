import {ComponentFixture, TestBed} from '@angular/core/testing';

import {StatisticPair} from './statistic-pair';
import {MenuComponent} from '../../menu/menu.component';
import {testComponentTranslation, testTranslations,} from '../../../mocks/test-functions';
import Keycloak from 'keycloak-js';
import {MockKeycloak} from '../../../mocks/mock-keycloak';
import {KEYCLOAK_EVENT_SIGNAL} from 'keycloak-angular';
import {MOCK_KEYCLOAK_EVENT_SIGNAL} from '../../../mocks/mock-keycloak-signal';
import {ActivatedRoute} from '@angular/router';
import {mockRoute} from '../../../mocks/activated-route-mock';
import {mockStatisticStore} from '../../../mocks/mock-store';
import {statisticStore} from '../statistics.signal-store';

describe('StatisticPair', () => {
  let component: StatisticPair;
  let fixture: ComponentFixture<StatisticPair>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StatisticPair, MenuComponent, testTranslations()],
      providers: [
        {provide: Keycloak, useClass: MockKeycloak},
        {
          provide: KEYCLOAK_EVENT_SIGNAL,
          useValue: MOCK_KEYCLOAK_EVENT_SIGNAL,
        },
        {provide: statisticStore, useValue: mockStatisticStore},
        {provide: ActivatedRoute, useValue: mockRoute},
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
