import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountListForm } from './account-list-form';
import { AccountList } from '../account-list/account-list';
import { MenuComponent } from '../../menu/menu.component';
import Keycloak from 'keycloak-js';
import { MockKeycloak } from '../../../mocks/mock-keycloak';
import { KEYCLOAK_EVENT_SIGNAL } from 'keycloak-angular';
import { MOCK_KEYCLOAK_EVENT_SIGNAL } from '../../../mocks/mock-keycloak-signal';
import { provideMockStore } from '@ngrx/store/testing';
import { ActivatedRoute } from '@angular/router';
import { mockRoute } from '../../../mocks/activated-route-mock';
import { initialAccountState } from '../state/account.reducers';
import { TranslateService } from '@ngx-translate/core';
import { testTranslations } from '../../../mocks/test-functions';

describe('AccountListForm', () => {
  let component: AccountListForm;
  let fixture: ComponentFixture<AccountListForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        AccountListForm,
        AccountList,
        MenuComponent,
        testTranslations(),
      ],
      providers: [
        { provide: Keycloak, useClass: MockKeycloak },
        {
          provide: KEYCLOAK_EVENT_SIGNAL,
          useValue: MOCK_KEYCLOAK_EVENT_SIGNAL,
        },
        provideMockStore({ initialState: initialAccountState }),
        { provide: ActivatedRoute, useValue: mockRoute },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AccountListForm);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render page in english (default)', () => {
    const translateService = TestBed.inject(TranslateService);
    translateService.setDefaultLang('en');
    const fixture = TestBed.createComponent(AccountListForm);

    fixture.detectChanges();
    const idElement: HTMLElement = fixture.nativeElement.querySelector(
      '#labelAccountSystem',
    );
    expect(idElement.innerText).toContain('System Accounts');
  });

  it('should render page in proper language', () => {
    const fixture = TestBed.createComponent(AccountListForm);

    const translateService = TestBed.inject(TranslateService);
    translateService.use('pl');

    fixture.detectChanges();
    const idElement: HTMLElement = fixture.nativeElement.querySelector(
      '#labelAccountSystem',
    );
    expect(idElement.innerText).toContain('Konta systemowe');
  });
});
