import {ComponentFixture, TestBed} from '@angular/core/testing';

import {MessageListForm} from './message-list-form';
import {MenuComponent} from '../../menu/menu.component';
import Keycloak from 'keycloak-js';
import {MockKeycloak} from '../../../mocks/mock-keycloak';
import {KEYCLOAK_EVENT_SIGNAL} from 'keycloak-angular';
import {MOCK_KEYCLOAK_EVENT_SIGNAL} from '../../../mocks/mock-keycloak-signal';
import {provideMockStore} from '@ngrx/store/testing';
import {ActivatedRoute} from '@angular/router';
import {mockRoute} from '../../../mocks/activated-route-mock';
import {MessageList} from '../message-list/message-list';
import {initialMessageState} from '../state/message.reducers';
import {testComponentTranslation, testTranslations} from '../../../mocks/test-functions';

describe('MessageListForm', () => {
  let component: MessageListForm;
  let fixture: ComponentFixture<MessageListForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        MessageListForm,
        MessageList,
        MenuComponent,
        testTranslations(),
      ],
      providers: [
        {provide: Keycloak, useClass: MockKeycloak},
        {
          provide: KEYCLOAK_EVENT_SIGNAL,
          useValue: MOCK_KEYCLOAK_EVENT_SIGNAL,
        },
        provideMockStore({initialState: initialMessageState}),
        {provide: ActivatedRoute, useValue: mockRoute},
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
    testComponentTranslation(fixture, 'en', '#dateToLabel', 'Date To');
  });

  it('should render page in proper language', () => {
    testComponentTranslation(fixture, 'pl', '#dateToLabel', 'Data do');
  });
});
