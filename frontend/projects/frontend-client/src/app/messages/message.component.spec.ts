import {ComponentFixture, TestBed} from '@angular/core/testing';

import {MessageComponent} from './message.component';
import {ActivatedRoute} from '@angular/router';
import {mockRoute} from '../../mocks/mock-activated-route';
import Keycloak from 'keycloak-js';
import {MockKeycloak} from '../../mocks/mock-keycloak';
import {KEYCLOAK_EVENT_SIGNAL} from 'keycloak-angular';
import {MOCK_KEYCLOAK_EVENT_SIGNAL} from '../../mocks/mock-keycloak-signal';
import {testComponentTranslation, testTranslations,} from '../../mocks/test-functions';

describe('MessageComponent', () => {
  let component: MessageComponent;
  let fixture: ComponentFixture<MessageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MessageComponent, testTranslations()],
      providers: [
        {provide: ActivatedRoute, useValue: mockRoute},
        {
          provide: KEYCLOAK_EVENT_SIGNAL,
          useValue: MOCK_KEYCLOAK_EVENT_SIGNAL,
        },
        {provide: Keycloak, useClass: MockKeycloak},
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(MessageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render page in english (default)', () => {
    testComponentTranslation(
      MessageComponent,
      'en',
      '#messageList',
      'List messages',
    );
  });

  it('should render page in proper language', () => {
    testComponentTranslation(
      MessageComponent,
      'pl',
      '#messageList',
      'Lista wiadomości',
    );
  });
});
