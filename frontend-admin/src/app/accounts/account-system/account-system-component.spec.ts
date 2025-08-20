import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountSystemComponent } from './account-system-component';
import { ActivatedRoute } from '@angular/router';
import { mockRoute } from '../../../mocks/activated-route-mock';
import Keycloak from 'keycloak-js';
import { MockKeycloak } from '../../../mocks/mock-keycloak';
import { KEYCLOAK_EVENT_SIGNAL } from 'keycloak-angular';
import { MOCK_KEYCLOAK_EVENT_SIGNAL } from '../../../mocks/mock-keycloak-signal';
import { provideMockStore } from '@ngrx/store/testing';
import { initialAccountState } from '../state/account.reducers';
import { TranslateService } from '@ngx-translate/core';
import { testTranslations } from '../../../mocks/test-functions';

describe('AccountSystemComponent', () => {
  let component: AccountSystemComponent;
  let fixture: ComponentFixture<AccountSystemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AccountSystemComponent, testTranslations()],
      providers: [
        { provide: ActivatedRoute, useValue: mockRoute },
        { provide: Keycloak, useClass: MockKeycloak },
        {
          provide: KEYCLOAK_EVENT_SIGNAL,
          useValue: MOCK_KEYCLOAK_EVENT_SIGNAL,
        },
        provideMockStore({ initialState: initialAccountState }),
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
    const translateService = TestBed.inject(TranslateService);
    translateService.setDefaultLang('en');
    const fixture = TestBed.createComponent(AccountSystemComponent);
    fixture.detectChanges();
    const idElement: HTMLElement =
      fixture.nativeElement.querySelector('#currency');
    expect(idElement.innerText).toContain('Currency');
  });

  it('should render page in proper language', () => {
    const fixture = TestBed.createComponent(AccountSystemComponent);

    const translateService = TestBed.inject(TranslateService);
    translateService.use('pl');

    fixture.detectChanges();
    const idElement: HTMLElement =
      fixture.nativeElement.querySelector('#currency');
    expect(idElement.innerText).toContain('Waluta');
  });
});
