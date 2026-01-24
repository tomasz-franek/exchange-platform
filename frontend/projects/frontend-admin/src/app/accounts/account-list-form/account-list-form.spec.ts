import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountListForm } from './account-list-form';
import { AccountList } from '../account-list/account-list';
import { MenuComponent } from '../../menu/menu.component';
import Keycloak from 'keycloak-js';
import { MockKeycloak } from '../../../mocks/mock-keycloak';
import { KEYCLOAK_EVENT_SIGNAL } from 'keycloak-angular';
import { MOCK_KEYCLOAK_EVENT_SIGNAL } from '../../../mocks/mock-keycloak-signal';
import { ActivatedRoute } from '@angular/router';
import { mockRoute } from '../../../mocks/activated-route-mock';
import { testComponentTranslation } from '../../../mocks/test-functions';
import {
  mockAccountsStore,
  mockPropertyStore,
} from '../../../mocks/mock-store';
import { AccountsStore } from '../accounts.signal-store';
import { PropertyStore } from '../../properties/properties.signal-store';
import { provideTranslateTestingService } from '../../../mocks/fake-translation-loader';
import assets_en from '../../../assets/i18n/en.json';
import assets_pl from '../../../assets/i18n/pl.json';

describe('AccountListForm', () => {
  let component: AccountListForm;
  let fixture: ComponentFixture<AccountListForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AccountListForm, AccountList, MenuComponent],
      providers: [
        { provide: Keycloak, useClass: MockKeycloak },
        {
          provide: KEYCLOAK_EVENT_SIGNAL,
          useValue: MOCK_KEYCLOAK_EVENT_SIGNAL,
        },
        { provide: AccountsStore, useValue: mockAccountsStore },
        { provide: PropertyStore, useValue: mockPropertyStore },
        { provide: ActivatedRoute, useValue: mockRoute },
        provideTranslateTestingService({
          en: assets_en,
          pl: assets_pl,
        }),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AccountListForm);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render page in english (default)', () => {
    testComponentTranslation(
      AccountListForm,
      'en',
      '#accountSystem',
      'System Accounts',
    );
  });

  it('should render page in proper language', () => {
    testComponentTranslation(
      AccountListForm,
      'pl',
      '#accountSystem',
      'Konta systemowe',
    );
  });
});
