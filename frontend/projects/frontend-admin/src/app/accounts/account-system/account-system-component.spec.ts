import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountSystemComponent } from './account-system-component';
import { ActivatedRoute } from '@angular/router';
import { mockRoute } from '../../../mocks/activated-route-mock';
import Keycloak from 'keycloak-js';
import { MockKeycloak } from '../../../mocks/mock-keycloak';
import { KEYCLOAK_EVENT_SIGNAL } from 'keycloak-angular';
import { MOCK_KEYCLOAK_EVENT_SIGNAL } from '../../../mocks/mock-keycloak-signal';
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

describe('AccountSystemComponent - Admin', () => {
  let component: AccountSystemComponent;
  let fixture: ComponentFixture<AccountSystemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AccountSystemComponent],
      providers: [
        { provide: ActivatedRoute, useValue: mockRoute },
        { provide: PropertyStore, useValue: mockPropertyStore },
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

    fixture = TestBed.createComponent(AccountSystemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render page in english (default)', () => {
    testComponentTranslation(
      AccountSystemComponent,
      'en',
      '#currency',
      'Currency',
    );
  });

  it('should render page in proper language', () => {
    testComponentTranslation(
      AccountSystemComponent,
      'pl',
      '#currency',
      'Waluta',
    );
  });
});
