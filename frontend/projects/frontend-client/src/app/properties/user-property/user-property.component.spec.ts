import {ComponentFixture, TestBed} from '@angular/core/testing';

import {UserPropertyComponent} from './user-property.component';
import {ActivatedRoute} from '@angular/router';
import {mockRoute} from '../../../mocks/mock-activated-route';
import {provideMockStore} from '@ngrx/store/testing';
import {initialAccountState} from '../../accounts/state/account.reducers';
import Keycloak from 'keycloak-js';
import {MockKeycloak} from '../../../mocks/mock-keycloak';
import {KEYCLOAK_EVENT_SIGNAL} from 'keycloak-angular';
import {MOCK_KEYCLOAK_EVENT_SIGNAL} from '../../../mocks/mock-keycloak-signal';
import {testComponentTranslation, testTranslations,} from '../../../mocks/test-functions';

describe('UserPropertyComponent', () => {
  let component: UserPropertyComponent;
  let fixture: ComponentFixture<UserPropertyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserPropertyComponent, testTranslations()],
      providers: [
        {provide: ActivatedRoute, useValue: mockRoute},
        provideMockStore({initialState: initialAccountState}),
        {provide: Keycloak, useClass: MockKeycloak},
        {
          provide: KEYCLOAK_EVENT_SIGNAL,
          useValue: MOCK_KEYCLOAK_EVENT_SIGNAL,
        },
        {provide: ActivatedRoute, useValue: mockRoute},
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(UserPropertyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render page in english (default)', () => {
    testComponentTranslation(UserPropertyComponent, 'en', '#save', 'Save');
  });

  it('should render page in proper language Polish', () => {
    testComponentTranslation(UserPropertyComponent, 'pl', '#save', 'Zapisz');
  });

  it('should render page in proper language Spanish', () => {
    testComponentTranslation(UserPropertyComponent, 'es', '#save', 'Guardar');
  });

  it('should render page in proper language Hindi', () => {
    testComponentTranslation(UserPropertyComponent, 'hi', '#save', 'सहेजें');
  });

  it('should render page in proper language Chinese', () => {
    testComponentTranslation(UserPropertyComponent, 'zhcn', '#save', '保存');
  });
});
