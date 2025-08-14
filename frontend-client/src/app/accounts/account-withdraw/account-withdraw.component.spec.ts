import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountWithdrawComponent } from './account-withdraw.component';
import { TranslateService } from '@ngx-translate/core';
import { provideMockStore } from '@ngrx/store/testing';
import { initialAccountState } from '../state/account.reducers';
import Keycloak from 'keycloak-js';
import { MockKeycloak } from '../../../mocks/mock-keycloak';
import { KEYCLOAK_EVENT_SIGNAL } from 'keycloak-angular';
import { MOCK_KEYCLOAK_EVENT_SIGNAL } from '../../../mocks/mock-keycloak-signal';
import { ActivatedRoute } from '@angular/router';
import { mockRoute } from '../../../mocks/mock-activated-route';
import { TranslateTestingModule } from 'ngx-translate-testing';
import assets_en from '../../../assets/i18n/en.json';
import assets_pl from '../../../assets/i18n/pl.json';

describe('AccountWithdrawComponent', () => {
  let component: AccountWithdrawComponent;
  let fixture: ComponentFixture<AccountWithdrawComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AccountWithdrawComponent,
        TranslateTestingModule.withTranslations(
          'en', assets_en
        ).withTranslations('pl', assets_pl)
      ],
      providers: [
        provideMockStore({ initialState: initialAccountState }),
        { provide: Keycloak, useClass: MockKeycloak },
        {
          provide: KEYCLOAK_EVENT_SIGNAL,
          useValue: MOCK_KEYCLOAK_EVENT_SIGNAL
        },
        { provide: ActivatedRoute, useValue: mockRoute }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AccountWithdrawComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render page in english (default)', () => {
    const translateService = TestBed.inject(TranslateService);
    translateService.setDefaultLang('en');
    const fixture = TestBed.createComponent(AccountWithdrawComponent);

    fixture.detectChanges();
    const idElement: HTMLElement = fixture.nativeElement.querySelector('#send');
    expect(idElement.innerText).toContain('Withdraw');
  });

  it('should render page in proper language', () => {
    const fixture = TestBed.createComponent(AccountWithdrawComponent);

    const translateService = TestBed.inject(TranslateService);
    translateService.use('pl');

    fixture.detectChanges();
    const idElement: HTMLElement = fixture.nativeElement.querySelector('#send');
    expect(idElement.innerText).toContain('Wypłać');
  });
});
