import {ComponentFixture, TestBed} from '@angular/core/testing';

import {MessageList} from './message-list';
import {testComponentTranslation, testTranslations} from '../../../mocks/test-functions';
import {FormBuilder, ReactiveFormsModule} from '@angular/forms';
import Keycloak from 'keycloak-js';
import {MockKeycloak} from '../../../mocks/mock-keycloak';
import {KEYCLOAK_EVENT_SIGNAL} from 'keycloak-angular';
import {MOCK_KEYCLOAK_EVENT_SIGNAL} from '../../../mocks/mock-keycloak-signal';
import {ActivatedRoute} from '@angular/router';
import {mockRoute} from '../../../mocks/mock-activated-route';
import {messageStore} from '../messages.signal-store';
import {mockMessagesStore} from '../../../mocks/mock-store';

describe('MessageList', () => {
  let component: MessageList;
  let fixture: ComponentFixture<MessageList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MessageList, testTranslations()],
      providers: [
        FormBuilder,
        ReactiveFormsModule,
        {provide: Keycloak, useClass: MockKeycloak},
        {provide: messageStore, useValue: mockMessagesStore},
        {
          provide: KEYCLOAK_EVENT_SIGNAL,
          useValue: MOCK_KEYCLOAK_EVENT_SIGNAL,
        },
        {provide: ActivatedRoute, useValue: mockRoute},
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
    testComponentTranslation(MessageList, 'en', '#textLabel', 'Text Message');
  });

  it('should render page in proper language', () => {
    testComponentTranslation(MessageList, 'pl', '#textLabel', 'Tekst wiadomości');
  });
});
