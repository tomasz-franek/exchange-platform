import {ComponentFixture, TestBed} from '@angular/core/testing';

import {TransactionExchangeAccount} from './transaction-exchange-account';
import {MenuComponent} from '../../menu/menu.component';
import {testComponentTranslation, testTranslations,} from '../../../mocks/test-functions';
import Keycloak from 'keycloak-js';
import {MockKeycloak} from '../../../mocks/mock-keycloak';
import {KEYCLOAK_EVENT_SIGNAL} from 'keycloak-angular';
import {MOCK_KEYCLOAK_EVENT_SIGNAL} from '../../../mocks/mock-keycloak-signal';
import {ActivatedRoute} from '@angular/router';
import {mockRoute} from '../../../mocks/activated-route-mock';
import {mockTransactionsStore} from '../../../mocks/mock-store';
import {TransactionsStore} from '../transactions.signal-store';

describe('TransactionExchangeAccount', () => {
  let component: TransactionExchangeAccount;
  let fixture: ComponentFixture<TransactionExchangeAccount>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TransactionExchangeAccount, MenuComponent, testTranslations()],
      providers: [
        {provide: Keycloak, useClass: MockKeycloak},
        {
          provide: KEYCLOAK_EVENT_SIGNAL,
          useValue: MOCK_KEYCLOAK_EVENT_SIGNAL,
        },
        {provide: TransactionsStore, useValue: mockTransactionsStore},
        {provide: ActivatedRoute, useValue: mockRoute},
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(TransactionExchangeAccount);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should render page in english (default)', () => {
    testComponentTranslation(TransactionExchangeAccount, 'en', '#currency', 'Currency');
  });

  it('should render page in proper language', () => {
    testComponentTranslation(TransactionExchangeAccount, 'pl', '#currency', 'Waluta');
  });
});
