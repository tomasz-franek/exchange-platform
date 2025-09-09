import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransactionSystemAccount } from './transaction-system-account';
import { MenuComponent } from '../../menu/menu.component';
import {
  testComponentTranslation,
  testTranslations,
} from '../../../mocks/test-functions';
import Keycloak from 'keycloak-js';
import { MockKeycloak } from '../../../mocks/mock-keycloak';
import { KEYCLOAK_EVENT_SIGNAL } from 'keycloak-angular';
import { MOCK_KEYCLOAK_EVENT_SIGNAL } from '../../../mocks/mock-keycloak-signal';
import { provideMockStore } from '@ngrx/store/testing';
import { initialTransactionState } from '../state/transaction.reducers';
import { ActivatedRoute } from '@angular/router';
import { mockRoute } from '../../../mocks/activated-route-mock';

describe('TransactionSystemAccount', () => {
  let component: TransactionSystemAccount;
  let fixture: ComponentFixture<TransactionSystemAccount>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TransactionSystemAccount, MenuComponent, testTranslations()],
      providers: [
        { provide: Keycloak, useClass: MockKeycloak },
        {
          provide: KEYCLOAK_EVENT_SIGNAL,
          useValue: MOCK_KEYCLOAK_EVENT_SIGNAL,
        },
        provideMockStore({ initialState: initialTransactionState }),
        { provide: ActivatedRoute, useValue: mockRoute },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(TransactionSystemAccount);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should render page in english (default)', () => {
    testComponentTranslation(fixture, 'en', '#currency', 'Currency');
  });

  it('should render page in proper language', () => {
    testComponentTranslation(fixture, 'pl', '#currency', 'Waluta');
  });
});
