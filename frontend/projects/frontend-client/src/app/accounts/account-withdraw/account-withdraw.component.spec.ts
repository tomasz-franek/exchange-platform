import {ComponentFixture, TestBed} from '@angular/core/testing';

import {AccountWithdrawComponent} from './account-withdraw.component';
import {provideMockStore} from '@ngrx/store/testing';
import {initialAccountState} from '../state/account.reducers';
import Keycloak from 'keycloak-js';
import {MockKeycloak} from '../../../mocks/mock-keycloak';
import {KEYCLOAK_EVENT_SIGNAL} from 'keycloak-angular';
import {MOCK_KEYCLOAK_EVENT_SIGNAL} from '../../../mocks/mock-keycloak-signal';
import {ActivatedRoute} from '@angular/router';
import {mockRoute} from '../../../mocks/mock-activated-route';
import {testComponentTranslation, testTranslations,} from '../../../mocks/test-functions';

describe('AccountWithdrawComponent', () => {
  let component: AccountWithdrawComponent;
  let fixture: ComponentFixture<AccountWithdrawComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AccountWithdrawComponent, testTranslations()],
      providers: [
        provideMockStore({initialState: initialAccountState}),
        {provide: Keycloak, useClass: MockKeycloak},
        {
          provide: KEYCLOAK_EVENT_SIGNAL,
          useValue: MOCK_KEYCLOAK_EVENT_SIGNAL,
        },
        {provide: ActivatedRoute, useValue: mockRoute},
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AccountWithdrawComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render page in english (default)', () => {
    testComponentTranslation(AccountWithdrawComponent, 'en', '#send', 'Withdraw');
  });

  it('should render page in proper language', () => {
    testComponentTranslation(AccountWithdrawComponent, 'pl', '#send', 'Wypłać');
  });
});
