import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountSystemOperationListComponent } from './account-system-operation-list-component';
import { provideMockStore } from '@ngrx/store/testing';
import { initialAccountState } from '../state/account.reducers';
import { ActivatedRoute } from '@angular/router';
import { mockRoute } from '../../../mocks/activated-route-mock';
import Keycloak from 'keycloak-js';
import { MockKeycloak } from '../../../mocks/mock-keycloak';
import { KEYCLOAK_EVENT_SIGNAL } from 'keycloak-angular';
import { MOCK_KEYCLOAK_EVENT_SIGNAL } from '../../../mocks/mock-keycloak-signal';
import { TranslateService } from '@ngx-translate/core';
import { testTranslations } from '../../../mocks/test-functions';

describe('AccountSystemOperationListComponent', () => {
  let component: AccountSystemOperationListComponent;
  let fixture: ComponentFixture<AccountSystemOperationListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AccountSystemOperationListComponent, testTranslations()],
      providers: [
        provideMockStore({ initialState: initialAccountState }),
        { provide: ActivatedRoute, useValue: mockRoute },
        { provide: Keycloak, useClass: MockKeycloak },
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
    const translateService = TestBed.inject(TranslateService);
    translateService.setDefaultLang('en');
    const fixture = TestBed.createComponent(
      AccountSystemOperationListComponent,
    );
    fixture.detectChanges();
    const idElement: HTMLElement =
      fixture.nativeElement.querySelector('#buttonBack');
    expect(idElement.innerText).toContain('Back');
  });

  it('should render page in proper language', () => {
    const fixture = TestBed.createComponent(
      AccountSystemOperationListComponent,
    );

    const translateService = TestBed.inject(TranslateService);
    translateService.use('pl');

    fixture.detectChanges();
    const idElement: HTMLElement =
      fixture.nativeElement.querySelector('#buttonBack');
    expect(idElement.innerText).toContain('Powrót');
  });
});
