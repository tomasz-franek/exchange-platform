import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransactionListForm } from './transaction-list-form';
import Keycloak from 'keycloak-js';
import { MockKeycloak } from '../../../mocks/mock-keycloak';
import { KEYCLOAK_EVENT_SIGNAL } from 'keycloak-angular';
import { MOCK_KEYCLOAK_EVENT_SIGNAL } from '../../../mocks/mock-keycloak-signal';
import { MenuComponent } from '../../menu/menu.component';
import { ActivatedRoute } from '@angular/router';
import { mockRoute } from '../../../mocks/activated-route-mock';
import {
  testComponentTranslation,
  testTranslations,
} from '../../../mocks/test-functions';
import {
  mockAccountsStore,
  mockTransactionsStore,
} from '../../../mocks/mock-store';
import { TransactionsStore } from '../transactions.signal-store';
import { AdminAccountsService } from '../../api/api/adminAccounts.service';
import { AccountsStore } from '../../accounts/accounts.signal-store';
import { beforeEach, describe, expect, it, vi } from 'vitest';

describe('TransactionListForm', () => {
  let component: TransactionListForm;
  let fixture: ComponentFixture<TransactionListForm>;
  const accountServiceSpy = {
    loadAccounts: vi.fn().mockName('AdminAccountsService.loadAccounts'),
    saveAccountDeposit: vi
      .fn()
      .mockName('AdminAccountsService.saveAccountDeposit'),
    saveWithdrawRequest: vi
      .fn()
      .mockName('AdminAccountsService.saveWithdrawRequest'),
    loadSystemAccountList: vi
      .fn()
      .mockName('AdminAccountsService.loadSystemAccountList'),
    loadExchangeAccountList: vi
      .fn()
      .mockName('AdminAccountsService.loadExchangeAccountList'),
    loadAccountOperationList: vi
      .fn()
      .mockName('AdminAccountsService.loadAccountOperationList'),
    loadAccountAmount: vi
      .fn()
      .mockName('AdminAccountsService.loadAccountAmount'),
    configuration: vi.fn().mockName('AdminAccountsService.configuration'),
    loadBankAccountList: vi
      .fn()
      .mockName('AdminAccountsService.loadBankAccountList'),
    validateBankAccount: vi
      .fn()
      .mockName('AdminAccountsService.validateBankAccount'),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TransactionListForm, MenuComponent, testTranslations()],
      providers: [
        { provide: Keycloak, useClass: MockKeycloak },
        {
          provide: KEYCLOAK_EVENT_SIGNAL,
          useValue: MOCK_KEYCLOAK_EVENT_SIGNAL,
        },
        { provide: TransactionsStore, useValue: mockTransactionsStore },
        { provide: AccountsStore, useValue: mockAccountsStore },
        { provide: AdminAccountsService, useValue: accountServiceSpy },
        { provide: ActivatedRoute, useValue: mockRoute },
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
    testComponentTranslation(
      TransactionListForm,
      'en',
      '#transactionList',
      'Transaction List',
    );
  });

  it('should render page in proper language', () => {
    testComponentTranslation(
      TransactionListForm,
      'pl',
      '#transactionList',
      'Lista transakcji',
    );
  });
});
