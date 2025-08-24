import {ComponentFixture, TestBed} from '@angular/core/testing';

import {AccountSystemComponent} from './account-system-component';
import {ActivatedRoute} from '@angular/router';
import {mockRoute} from '../../../mocks/activated-route-mock';
import Keycloak from 'keycloak-js';
import {MockKeycloak} from '../../../mocks/mock-keycloak';
import {KEYCLOAK_EVENT_SIGNAL} from 'keycloak-angular';
import {MOCK_KEYCLOAK_EVENT_SIGNAL} from '../../../mocks/mock-keycloak-signal';
import {provideMockStore} from '@ngrx/store/testing';
import {initialAccountState} from '../state/account.reducers';
import {testComponentTranslation, testTranslations} from '../../../mocks/test-functions';

describe('AccountSystemComponent', () => {
  let component: AccountSystemComponent;
  let fixture: ComponentFixture<AccountSystemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AccountSystemComponent, testTranslations()],
      providers: [
        {provide: ActivatedRoute, useValue: mockRoute},
        {provide: Keycloak, useClass: MockKeycloak},
        {
          provide: KEYCLOAK_EVENT_SIGNAL,
          useValue: MOCK_KEYCLOAK_EVENT_SIGNAL,
        },
        provideMockStore({initialState: initialAccountState}),
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
    testComponentTranslation(fixture, 'en', '#currency', 'Currency');
  });

  it('should render page in proper language', () => {
    testComponentTranslation(fixture, 'pl', '#currency', 'Waluta');
  });
});
