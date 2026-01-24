import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountWithdrawComponent } from './account-withdraw.component';
import Keycloak from 'keycloak-js';
import { MockKeycloak } from '../../../mocks/mock-keycloak';
import { KEYCLOAK_EVENT_SIGNAL } from 'keycloak-angular';
import { MOCK_KEYCLOAK_EVENT_SIGNAL } from '../../../mocks/mock-keycloak-signal';
import { ActivatedRoute } from '@angular/router';
import { mockRoute } from '../../../mocks/mock-activated-route';
import { testComponentTranslation } from '../../../mocks/test-functions';
import { AccountsStore } from '../accounts.signal-store';
import {
  mockAccountsStore,
  mockPropertyStore,
} from '../../../mocks/mock-store';
import { PropertyStore } from '../../properties/properties.signal-store';
import { provideTranslateTestingService } from '../../../mocks/fake-translation-loader';
import assets_en from '../../../assets/i18n/en.json';
import assets_pl from '../../../assets/i18n/pl.json';

describe('AccountWithdrawComponent', () => {
  let component: AccountWithdrawComponent;
  let fixture: ComponentFixture<AccountWithdrawComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AccountWithdrawComponent],
      providers: [
        { provide: AccountsStore, useValue: mockAccountsStore },
        { provide: PropertyStore, useValue: mockPropertyStore },
        { provide: Keycloak, useClass: MockKeycloak },
        {
          provide: KEYCLOAK_EVENT_SIGNAL,
          useValue: MOCK_KEYCLOAK_EVENT_SIGNAL,
        },
        { provide: ActivatedRoute, useValue: mockRoute },
        provideTranslateTestingService({
          en: assets_en,
          pl: assets_pl,
        }),
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
    testComponentTranslation(
      AccountWithdrawComponent,
      'en',
      '#send',
      'Withdraw',
    );
  });

  it('should render page in proper language', () => {
    testComponentTranslation(AccountWithdrawComponent, 'pl', '#send', 'Wypłać');
  });
});
