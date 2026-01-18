import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountBankComponent } from './account-bank';
import {
  testComponentTranslation,
  testTranslations,
} from '../../../mocks/test-functions';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { mockRoute } from '../../../mocks/activated-route-mock';
import Keycloak from 'keycloak-js';
import { MockKeycloak } from '../../../mocks/mock-keycloak';
import { KEYCLOAK_EVENT_SIGNAL } from 'keycloak-angular';
import { MOCK_KEYCLOAK_EVENT_SIGNAL } from '../../../mocks/mock-keycloak-signal';
import { AccountsStore } from '../accounts.signal-store';
import {
  mockAccountsStore,
  mockPropertyStore,
} from '../../../mocks/mock-store';
import { PropertyStore } from '../../properties/properties.signal-store';

describe('AccountBankComponent', () => {
  let component: AccountBankComponent;
  let fixture: ComponentFixture<AccountBankComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AccountBankComponent, testTranslations()],
      providers: [
        FormBuilder,
        ReactiveFormsModule,
        { provide: AccountsStore, useValue: mockAccountsStore },
        { provide: PropertyStore, useValue: mockPropertyStore },
        { provide: ActivatedRoute, useValue: mockRoute },
        { provide: Keycloak, useClass: MockKeycloak },
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
