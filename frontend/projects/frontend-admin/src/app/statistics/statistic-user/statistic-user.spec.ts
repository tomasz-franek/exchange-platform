import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StatisticUser } from './statistic-user';
import {
  testComponentTranslation,
  testTranslations,
} from '../../../mocks/test-functions';
import Keycloak from 'keycloak-js';
import { MockKeycloak } from '../../../mocks/mock-keycloak';
import { KEYCLOAK_EVENT_SIGNAL } from 'keycloak-angular';
import { MOCK_KEYCLOAK_EVENT_SIGNAL } from '../../../mocks/mock-keycloak-signal';
import { ActivatedRoute } from '@angular/router';
import { mockRoute } from '../../../mocks/activated-route-mock';
import { MenuComponent } from '../../menu/menu.component';
import { StatisticStore } from '../statistics.signal-store';
import {
  mockPropertyStore,
  mockStatisticStore,
} from '../../../mocks/mock-store';
import { PropertyStore } from '../../properties/properties.signal-store';

describe('StatisticUser', () => {
  let component: StatisticUser;
  let fixture: ComponentFixture<StatisticUser>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StatisticUser, MenuComponent, testTranslations()],
      providers: [
        { provide: Keycloak, useClass: MockKeycloak },
        { provide: PropertyStore, useValue: mockPropertyStore },
        {
          provide: KEYCLOAK_EVENT_SIGNAL,
          useValue: MOCK_KEYCLOAK_EVENT_SIGNAL,
        },
        { provide: StatisticStore, useValue: mockStatisticStore },
        { provide: ActivatedRoute, useValue: mockRoute },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(StatisticUser);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should render page in english (default)', () => {
    testComponentTranslation(
      StatisticUser,
      'en',
      '#statisticsTransaction',
      'Transactions',
    );
  });

  it('should render page in proper language', () => {
    testComponentTranslation(
      StatisticUser,
      'pl',
      '#statisticsTransaction',
      'Transakcje',
    );
  });
});
