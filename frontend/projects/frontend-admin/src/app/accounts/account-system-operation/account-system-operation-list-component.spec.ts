import {ComponentFixture, TestBed} from '@angular/core/testing';

import {AccountSystemOperationListComponent} from './account-system-operation-list-component';
import {provideMockStore} from '@ngrx/store/testing';
import {initialAccountState} from '../state/account.reducers';
import {ActivatedRoute, Router} from '@angular/router';
import {mockRoute} from '../../../mocks/activated-route-mock';
import Keycloak from 'keycloak-js';
import {MockKeycloak} from '../../../mocks/mock-keycloak';
import {KEYCLOAK_EVENT_SIGNAL} from 'keycloak-angular';
import {MOCK_KEYCLOAK_EVENT_SIGNAL} from '../../../mocks/mock-keycloak-signal';
import {testComponentTranslation, testTranslations} from '../../../mocks/test-functions';
import {RouterTestingModule} from '@angular/router/testing';

describe('AccountSystemOperationListComponent', () => {
  let component: AccountSystemOperationListComponent;
  let fixture: ComponentFixture<AccountSystemOperationListComponent>;
  let router: Router;

  beforeEach(async () => {
    const routerMock = {
      navigate: jasmine.createSpy('navigate')
    };
    await TestBed.configureTestingModule({
      imports: [AccountSystemOperationListComponent, testTranslations(), RouterTestingModule],
      providers: [
        provideMockStore({initialState: initialAccountState}),
        {provide: ActivatedRoute, useValue: mockRoute},
        {provide: Keycloak, useClass: MockKeycloak},
        {
          provide: KEYCLOAK_EVENT_SIGNAL,
          useValue: MOCK_KEYCLOAK_EVENT_SIGNAL,
        },
        {provide: Router, useValue: routerMock},
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AccountSystemOperationListComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render page in english (default)', () => {
    testComponentTranslation(AccountSystemOperationListComponent, 'en', '#buttonBack', 'Back');
  });

  it('should render page in proper language', () => {
    testComponentTranslation(AccountSystemOperationListComponent, 'pl', '#buttonBack', 'Powrót');
  });

  it('should navigate to account-system on calling backToSystemAccountList', () => {
    component.backToSystemAccountList();
    expect(router.navigate).toHaveBeenCalledWith(['accounts/account-system']);
  });
});
