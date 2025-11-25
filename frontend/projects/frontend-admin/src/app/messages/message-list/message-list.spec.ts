import {ComponentFixture, TestBed} from '@angular/core/testing';

import {MessageList} from './message-list';
import {ActivatedRoute} from '@angular/router';
import {mockRoute} from '../../../mocks/activated-route-mock';
import Keycloak from 'keycloak-js';
import {MockKeycloak} from '../../../mocks/mock-keycloak';
import {KEYCLOAK_EVENT_SIGNAL} from 'keycloak-angular';
import {MOCK_KEYCLOAK_EVENT_SIGNAL} from '../../../mocks/mock-keycloak-signal';
import {testComponentTranslation, testTranslations} from '../../../mocks/test-functions';
import {AccountsStore} from '../../accounts/accounts.signal-store';
import {mockAccountsStore, mockMessagesStore} from '../../../mocks/mock-store';
import {MessageStore} from '../messages.signal-store';

describe('MessageList', () => {
  let component: MessageList;
  let fixture: ComponentFixture<MessageList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MessageList, testTranslations()],
      providers: [
        {provide: ActivatedRoute, useValue: mockRoute},
        {provide: Keycloak, useClass: MockKeycloak},
        {
          provide: KEYCLOAK_EVENT_SIGNAL,
          useValue: MOCK_KEYCLOAK_EVENT_SIGNAL,
        },
        {provide: AccountsStore, useValue: mockAccountsStore},
        {provide: MessageStore, useValue: mockMessagesStore},
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(MessageList);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render page in english (default)', () => {
    testComponentTranslation(MessageList, 'en', '#date', 'Date');
  });

  it('should render page in proper language', () => {
    testComponentTranslation(MessageList, 'pl', '#date', 'Data');
  });
});
