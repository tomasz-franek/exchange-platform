import {ComponentFixture, TestBed} from '@angular/core/testing';

import {MenuComponent} from './menu.component';
import Keycloak from 'keycloak-js';
import {MockKeycloak} from '../../mocks/mock-keycloak';
import {KEYCLOAK_EVENT_SIGNAL} from 'keycloak-angular';
import {ActivatedRoute} from '@angular/router';
import {mockRoute} from '../../mocks/mock-activated-route';
import {MOCK_KEYCLOAK_EVENT_SIGNAL} from '../../mocks/mock-keycloak-signal';
import {provideMockStore} from '@ngrx/store/testing';
import {initialAccountState} from '../accounts/state/account.reducers';
import {testComponentTranslation, testTranslations,} from '../../mocks/test-functions';

describe('MenuComponent', () => {
  let component: MenuComponent;
  let fixture: ComponentFixture<MenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MenuComponent, testTranslations()],
      providers: [
        {provide: Keycloak, useClass: MockKeycloak},
        {
          provide: KEYCLOAK_EVENT_SIGNAL,
          useValue: MOCK_KEYCLOAK_EVENT_SIGNAL,
        },
        {provide: ActivatedRoute, useValue: mockRoute},
        provideMockStore({initialState: initialAccountState}),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(MenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render page in english (default)', () => {
    testComponentTranslation(MenuComponent, 'en', '#tickets', 'Tickets');
  });

  it('should render page in proper language', () => {
    testComponentTranslation(MenuComponent, 'pl', '#tickets', 'Zlecenia');
  });
  // [
  //   {id: 'tickets', description: 'Tickets'},
  //   {id: 'accounts', description: 'Accounts'},
  //   {id: 'reports', description: 'Reports'},
  //   {id: 'messages', description: 'Messages'},
  //   {id: 'properties', description: 'Properties'},
  //   {id: 'rates', description: 'Rates'},
  // ].forEach(({id, description}) => {
  //   it(`should check the menu option ${description} when clicked`, () => {
  //     checkMenuChecked(fixture, `#${id}`);
  //   });
  // });
});
