import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StatisticTransaction } from './statistic-transaction';
import { MenuComponent } from '../../menu/menu.component';
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
import { PropertyStore } from '../../properties/properties.signal-store';
import { mockPropertyStore } from '../../../mocks/mock-store';

describe('StatisticTransaction', () => {
  let component: StatisticTransaction;
  let fixture: ComponentFixture<StatisticTransaction>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StatisticTransaction, MenuComponent, testTranslations()],
      providers: [
        { provide: Keycloak, useClass: MockKeycloak },
        { provide: PropertyStore, useValue: mockPropertyStore },
        {
          provide: KEYCLOAK_EVENT_SIGNAL,
          useValue: MOCK_KEYCLOAK_EVENT_SIGNAL,
        },
        { provide: ActivatedRoute, useValue: mockRoute },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(StatisticTransaction);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render page in english (default)', () => {
    testComponentTranslation(
      StatisticTransaction,
      'en',
      '#statisticsTransaction',
      'Transactions',
    );
  });

  it('should render page in proper language', () => {
    testComponentTranslation(
      StatisticTransaction,
      'pl',
      '#statisticsTransaction',
      'Transakcje',
    );
  });
});
