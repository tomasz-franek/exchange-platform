import {ComponentFixture, TestBed} from '@angular/core/testing';

import {AccountSystemOperationListComponent} from './account-system-operation-list-component';
import {ActivatedRoute} from '@angular/router';
import {mockRoute} from '../../../mocks/activated-route-mock';
import Keycloak from 'keycloak-js';
import {MockKeycloak} from '../../../mocks/mock-keycloak';
import {KEYCLOAK_EVENT_SIGNAL} from 'keycloak-angular';
import {MOCK_KEYCLOAK_EVENT_SIGNAL} from '../../../mocks/mock-keycloak-signal';
import {testComponentTranslation, testTranslations} from '../../../mocks/test-functions';
import {RouterTestingModule} from '@angular/router/testing';
import {accountsStore} from '../accounts.signal-store';
import {mockAccountsStore} from '../../../mocks/mock-store';

describe('AccountSystemOperationListComponent', () => {
  let component: AccountSystemOperationListComponent;
  let fixture: ComponentFixture<AccountSystemOperationListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AccountSystemOperationListComponent, testTranslations(), RouterTestingModule],
      providers: [
        {provide: accountsStore, useValue: mockAccountsStore},
        {provide: ActivatedRoute, useValue: mockRoute},
        {provide: Keycloak, useClass: MockKeycloak},
        {
          provide: KEYCLOAK_EVENT_SIGNAL,
          useValue: MOCK_KEYCLOAK_EVENT_SIGNAL,
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AccountSystemOperationListComponent);
    component = fixture.componentInstance;
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
});
