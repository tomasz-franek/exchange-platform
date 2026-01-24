import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserAccountComponent } from './user-account.component';
import { testComponentTranslation } from '../../../mocks/test-functions';
import { ActivatedRoute } from '@angular/router';
import { mockRoute } from '../../../mocks/activated-route-mock';
import { AccountsStore } from '../../accounts/accounts.signal-store';
import { mockAccountsStore } from '../../../mocks/mock-store';
import { provideTranslateTestingService } from '../../../mocks/fake-translation-loader';
import assets_en from '../../../assets/i18n/en.json';
import assets_pl from '../../../assets/i18n/pl.json';

describe('UserAccountComponent', () => {
  let component: UserAccountComponent;
  let fixture: ComponentFixture<UserAccountComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserAccountComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: mockRoute,
        },
        { provide: AccountsStore, useValue: mockAccountsStore },
        provideTranslateTestingService({
          en: assets_en,
          pl: assets_pl,
        }),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(UserAccountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render page in english (default)', () => {
    testComponentTranslation(
      UserAccountComponent,
      'en',
      '#userAccountLabel',
      'Accounts list',
    );
  });

  it('should render page in proper language', () => {
    testComponentTranslation(
      UserAccountComponent,
      'pl',
      '#userAccountLabel',
      'Lista kont',
    );
  });
});
