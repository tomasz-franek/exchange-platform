import {ComponentFixture, TestBed} from '@angular/core/testing';

import {TransactionListForm} from './transaction-list-form';
import Keycloak from 'keycloak-js';
import {MockKeycloak} from '../../../mocks/mock-keycloak';
import {KEYCLOAK_EVENT_SIGNAL} from 'keycloak-angular';
import {MOCK_KEYCLOAK_EVENT_SIGNAL} from '../../../mocks/mock-keycloak-signal';
import {MenuComponent} from '../../menu/menu.component';
import {TransactionList} from '../transaction-list/transaction-list';
import {ActivatedRoute} from '@angular/router';
import {mockRoute} from '../../../mocks/activated-route-mock';
import {testComponentTranslation, testTranslations} from '../../../mocks/test-functions';
import {AccountsStore} from '../../accounts/accounts.signal-store';
import {mockAccountsStore} from '../../../mocks/mock-store';

describe('TransactionListForm', () => {
  let component: TransactionListForm;
  let fixture: ComponentFixture<TransactionListForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        TransactionListForm,
        TransactionList,
        MenuComponent,
        testTranslations(),
      ],
      providers: [
        {provide: Keycloak, useClass: MockKeycloak},
        {
          provide: KEYCLOAK_EVENT_SIGNAL,
          useValue: MOCK_KEYCLOAK_EVENT_SIGNAL,
        },
        {provide: AccountsStore, useValue: mockAccountsStore},
        {provide: ActivatedRoute, useValue: mockRoute},
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(TransactionListForm);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should render page in english (default)', () => {
    testComponentTranslation(TransactionListForm, 'en', '#transactionList', 'Transaction List');
  });

  it('should render page in proper language', () => {
    testComponentTranslation(TransactionListForm, 'pl', '#transactionList', 'Lista transakcji');
  });
});
