import {ComponentFixture, TestBed} from '@angular/core/testing';

import {AccountBankComponent} from './account-bank';
import {testComponentTranslation, testTranslations,} from '../../../mocks/test-functions';
import {FormBuilder, ReactiveFormsModule} from '@angular/forms';
import {ActivatedRoute} from '@angular/router';
import {mockRoute} from '../../../mocks/activated-route-mock';
import Keycloak from 'keycloak-js';
import {MockKeycloak} from '../../../mocks/mock-keycloak';
import {KEYCLOAK_EVENT_SIGNAL} from 'keycloak-angular';
import {MOCK_KEYCLOAK_EVENT_SIGNAL} from '../../../mocks/mock-keycloak-signal';
import {accountsStore} from '../accounts.signal-store';
import {mockAccountsStore} from '../../../mocks/mock-store';

describe('AccountBankComponent', () => {
  let component: AccountBankComponent;
  let fixture: ComponentFixture<AccountBankComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AccountBankComponent, testTranslations()],
      providers: [
        FormBuilder,
        ReactiveFormsModule,
        {provide: accountsStore, useValue: mockAccountsStore},
        {provide: ActivatedRoute, useValue: mockRoute},
        {provide: Keycloak, useClass: MockKeycloak},
        {
          provide: KEYCLOAK_EVENT_SIGNAL,
          useValue: MOCK_KEYCLOAK_EVENT_SIGNAL,
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AccountBankComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should render page in english (default)', () => {
    testComponentTranslation(
      AccountBankComponent,
      'en',
      '#accountNumber',
      'Bank Account Number',
    );
  });

  it('should render page in proper language', () => {
    testComponentTranslation(
      AccountBankComponent,
      'pl',
      '#accountNumber',
      'Numer konta bankowego',
    );
  });
});
