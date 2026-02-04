import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountList } from './account-list';
import { ActivatedRoute } from '@angular/router';
import { mockRoute } from '../../../mocks/activated-route-mock';
import Keycloak from 'keycloak-js';
import { MockKeycloak } from '../../../mocks/mock-keycloak';
import { KEYCLOAK_EVENT_SIGNAL } from 'keycloak-angular';
import { MOCK_KEYCLOAK_EVENT_SIGNAL } from '../../../mocks/mock-keycloak-signal';
import { testComponentTranslation } from '../../../mocks/test-functions';
import { AccountsStore } from '../accounts.signal-store';
import { mockAccountsStore } from '../../../mocks/mock-store';
import { provideTranslateTestingService } from '../../../mocks/fake-translation-loader';
import assets_en from '../../../assets/i18n/en.json';
import assets_pl from '../../../assets/i18n/pl.json';

describe('AccountList', () => {
  let component: AccountList;
  let fixture: ComponentFixture<AccountList>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AccountList],
      providers: [
        { provide: ActivatedRoute, useValue: mockRoute },
        { provide: Keycloak, useClass: MockKeycloak },
        {
          provide: KEYCLOAK_EVENT_SIGNAL,
          useValue: MOCK_KEYCLOAK_EVENT_SIGNAL,
        },
        { provide: AccountsStore, useValue: mockAccountsStore },
        provideTranslateTestingService({
          en: assets_en,
          pl: assets_pl,
        }),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AccountList);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render page in english (default)', () => {
    testComponentTranslation(AccountList, 'en', '#amount', 'Amount');
  });

  it('should render page in proper language', () => {
    testComponentTranslation(AccountList, 'pl', '#amount', 'Ilość');
  });
});
