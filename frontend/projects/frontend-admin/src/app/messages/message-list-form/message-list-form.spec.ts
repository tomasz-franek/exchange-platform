import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MessageListForm } from './message-list-form';
import { MenuComponent } from '../../menu/menu.component';
import Keycloak from 'keycloak-js';
import { MockKeycloak } from '../../../mocks/mock-keycloak';
import { KEYCLOAK_EVENT_SIGNAL } from 'keycloak-angular';
import { MOCK_KEYCLOAK_EVENT_SIGNAL } from '../../../mocks/mock-keycloak-signal';
import { ActivatedRoute } from '@angular/router';
import { mockRoute } from '../../../mocks/activated-route-mock';
import { MessageList } from '../message-list/message-list';
import { testComponentTranslation } from '../../../mocks/test-functions';
import {
  mockAccountsStore,
  mockMessagesStore,
  mockPropertyStore,
} from '../../../mocks/mock-store';
import { MessageStore } from '../messages.signal-store';
import { AccountsStore } from '../../accounts/accounts.signal-store';
import { PropertyStore } from '../../properties/properties.signal-store';
import { provideTranslateTestingService } from '../../../mocks/fake-translation-loader';
import assets_en from '../../../assets/i18n/en.json';
import assets_pl from '../../../assets/i18n/pl.json';

describe('MessageListForm', () => {
  let component: MessageListForm;
  let fixture: ComponentFixture<MessageListForm>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [MessageListForm, MessageList, MenuComponent],
      providers: [
        { provide: Keycloak, useClass: MockKeycloak },
        {
          provide: KEYCLOAK_EVENT_SIGNAL,
          useValue: MOCK_KEYCLOAK_EVENT_SIGNAL,
        },
        { provide: MessageStore, useValue: mockMessagesStore },
        { provide: PropertyStore, useValue: mockPropertyStore },
        { provide: AccountsStore, useValue: mockAccountsStore },
        { provide: ActivatedRoute, useValue: mockRoute },
        provideTranslateTestingService({
          en: assets_en,
          pl: assets_pl,
        }),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(MessageListForm);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render page in english (default)', () => {
    testComponentTranslation(MessageListForm, 'en', '#dateToLabel', 'Date To');
  });

  it('should render page in proper language', () => {
    testComponentTranslation(MessageListForm, 'pl', '#dateToLabel', 'Data do');
  });
});
