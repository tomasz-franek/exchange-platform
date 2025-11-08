import {ComponentFixture, TestBed} from '@angular/core/testing';

import {AccountsComponent} from './accounts.component';
import {ActivatedRoute} from '@angular/router';
import {mockRoute} from '../../mocks/activated-route-mock';
import Keycloak from 'keycloak-js';
import {MockKeycloak} from '../../mocks/mock-keycloak';
import {KEYCLOAK_EVENT_SIGNAL} from 'keycloak-angular';
import {MOCK_KEYCLOAK_EVENT_SIGNAL} from '../../mocks/mock-keycloak-signal';
import {testComponentTranslation, testTranslations} from '../../mocks/test-functions';

describe('AccountsComponent', () => {
  let component: AccountsComponent;
  let fixture: ComponentFixture<AccountsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AccountsComponent, testTranslations()],
      providers: [
        {provide: ActivatedRoute, useValue: mockRoute},
        {provide: Keycloak, useClass: MockKeycloak},
        {
          provide: KEYCLOAK_EVENT_SIGNAL,
          useValue: MOCK_KEYCLOAK_EVENT_SIGNAL,
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AccountsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render page in english (default)', () => {
    testComponentTranslation(AccountsComponent, 'en', '#accountList', 'Account List');
  });

  it('should render page in proper language', () => {
    testComponentTranslation(AccountsComponent, 'pl', '#accountList', 'Lista kont');
  });
});
