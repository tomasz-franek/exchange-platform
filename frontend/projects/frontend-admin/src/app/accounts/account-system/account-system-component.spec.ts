import {ComponentFixture, TestBed} from '@angular/core/testing';

import {AccountSystemComponent} from './account-system-component';
import {ActivatedRoute, Router} from '@angular/router';
import {mockRoute} from '../../../mocks/activated-route-mock';
import Keycloak from 'keycloak-js';
import {MockKeycloak} from '../../../mocks/mock-keycloak';
import {KEYCLOAK_EVENT_SIGNAL} from 'keycloak-angular';
import {MOCK_KEYCLOAK_EVENT_SIGNAL} from '../../../mocks/mock-keycloak-signal';
import {provideMockStore} from '@ngrx/store/testing';
import {initialAccountState} from '../state/account.reducers';
import {testComponentTranslation, testTranslations} from '../../../mocks/test-functions';

describe('AccountSystemComponent - Admin', () => {
  let component: AccountSystemComponent;
  let fixture: ComponentFixture<AccountSystemComponent>;
  let router: Router;

  beforeEach(async () => {

    const routerMock = {
      navigate: jasmine.createSpy('navigate'),
      subscribe: jasmine.createSpy('subscribe'),
    };

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
        {provide: Router, useValue: routerMock}
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AccountSystemComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render page in english (default)', () => {
    testComponentTranslation(AccountSystemComponent, 'en', '#currency', 'Currency');
  });

  it('should render page in proper language', () => {
    testComponentTranslation(AccountSystemComponent, 'pl', '#currency', 'Waluta');
  });

  it('should navigate to account operations with an id', () => {
    const id = '12345';
    component.showTransactions(id);
    expect(router.navigate).toHaveBeenCalledWith(['accounts/account-operations', id]);
  });

  it('should not navigate if id is undefined', () => {
    component.showTransactions(undefined);
    expect(router.navigate).not.toHaveBeenCalled();
  });
});
