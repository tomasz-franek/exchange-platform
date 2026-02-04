import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PropertyWithdraw } from './property-withdraw';
import { ActivatedRoute } from '@angular/router';
import { mockRoute } from '../../../mocks/activated-route-mock';
import {
  mockAccountsStore,
  mockMessagesStore,
} from '../../../mocks/mock-store';
import { provideTranslateTestingService } from '../../../mocks/fake-translation-loader';
import assets_en from '../../../assets/i18n/en.json';
import assets_pl from '../../../assets/i18n/pl.json';
import { testComponentTranslation } from '../../../mocks/test-functions';
import { AccountsStore } from '../../accounts/accounts.signal-store';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MessageService } from 'primeng/api';
import Keycloak from 'keycloak-js';
import { MockKeycloak } from '../../../mocks/mock-keycloak';
import { KEYCLOAK_EVENT_SIGNAL } from 'keycloak-angular';
import { MOCK_KEYCLOAK_EVENT_SIGNAL } from '../../../mocks/mock-keycloak-signal';

describe('PropertyWithdraw', () => {
  let component: PropertyWithdraw;
  let fixture: ComponentFixture<PropertyWithdraw>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [PropertyWithdraw],
      providers: [
        FormBuilder,
        ReactiveFormsModule,
        { provide: ActivatedRoute, useValue: mockRoute },
        { provide: AccountsStore, useValue: mockAccountsStore },
        { provide: MessageService, useValue: mockMessagesStore },
        { provide: Keycloak, useClass: MockKeycloak },
        {
          provide: KEYCLOAK_EVENT_SIGNAL,
          useValue: MOCK_KEYCLOAK_EVENT_SIGNAL,
        },
        provideTranslateTestingService({
          en: assets_en,
          pl: assets_pl,
        }),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(PropertyWithdraw);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render page in english (default)', () => {
    testComponentTranslation(
      PropertyWithdraw,
      'en',
      '#minimumWithdrawAmountLabel',
      'Minimum Withdraw Amount',
    );
  });

  it('should render page in proper language', () => {
    testComponentTranslation(
      PropertyWithdraw,
      'pl',
      '#minimumWithdrawAmountLabel',
      'Minimalna ilość waluty do wypłaty',
    );
  });
});
