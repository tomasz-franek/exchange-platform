import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountEditComponent } from './account-edit.component';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { provideMockStore } from '@ngrx/store/testing';
import { initialAccountState } from '../state/account.reducers';
import { provideToastr } from 'ngx-toastr';
import Keycloak from 'keycloak-js';
import { MockKeycloak } from '../../../mocks/mock-keycloak';
import { KEYCLOAK_EVENT_SIGNAL } from 'keycloak-angular';
import { MOCK_KEYCLOAK_EVENT_SIGNAL } from '../../../mocks/mock-keycloak-signal';
import { ActivatedRoute } from '@angular/router';
import { mockRoute } from '../../../mocks/mock-activated-route';
import {
  testComponentTranslation,
  testTranslations,
} from '../../../mocks/test-functions';

describe('AccountEditComponent', () => {
  let component: AccountEditComponent;
  let fixture: ComponentFixture<AccountEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AccountEditComponent, testTranslations()],
      providers: [
        FormBuilder,
        ReactiveFormsModule,
        provideToastr(),
        provideMockStore({ initialState: initialAccountState }),
        { provide: Keycloak, useClass: MockKeycloak },
        {
          provide: KEYCLOAK_EVENT_SIGNAL,
          useValue: MOCK_KEYCLOAK_EVENT_SIGNAL,
        },
        { provide: ActivatedRoute, useValue: mockRoute },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AccountEditComponent);
    fixture.detectChanges();
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should render page in english (default)', () => {
    testComponentTranslation(fixture, 'en', '#send', 'Send order');
  });

  it('should render page in proper language', () => {
    testComponentTranslation(fixture, 'pl', '#send', 'Wyślij zlecenie');
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
