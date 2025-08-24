import {ComponentFixture, TestBed} from '@angular/core/testing';

import {MessageAdd} from './message-add';
import {testComponentTranslation, testTranslations} from '../../../mocks/test-functions';
import {provideMockStore} from '@ngrx/store/testing';
import {initialMessageState} from '../state/message.reducers';
import {ActivatedRoute} from '@angular/router';
import {mockRoute} from '../../../mocks/activated-route-mock';
import Keycloak from 'keycloak-js';
import {MockKeycloak} from '../../../mocks/mock-keycloak';
import {KEYCLOAK_EVENT_SIGNAL} from 'keycloak-angular';
import {MOCK_KEYCLOAK_EVENT_SIGNAL} from '../../../mocks/mock-keycloak-signal';

describe('MessageAdd', () => {
  let component: MessageAdd;
  let fixture: ComponentFixture<MessageAdd>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MessageAdd, testTranslations()],
      providers: [
        provideMockStore({initialState: initialMessageState}),
        {provide: ActivatedRoute, useValue: mockRoute},
        {provide: Keycloak, useClass: MockKeycloak},
        {
          provide: KEYCLOAK_EVENT_SIGNAL,
          useValue: MOCK_KEYCLOAK_EVENT_SIGNAL,
        },
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(MessageAdd);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render page in english (default)', () => {
    testComponentTranslation(fixture, 'en', '#labelText', 'Text Message');
  });

  it('should render page in proper language', () => {
    testComponentTranslation(fixture, 'pl', '#labelText', 'Tekst wiadomości');
  });
});
