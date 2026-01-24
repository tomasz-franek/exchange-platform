import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountFilter } from './account-filter';
import { ActivatedRoute } from '@angular/router';
import { mockRoute } from '../../../mocks/activated-route-mock';
import { testComponentTranslation } from '../../../mocks/test-functions';
import { AccountsStore } from '../accounts.signal-store';
import { mockAccountsStore } from '../../../mocks/mock-store';
import { provideTranslateTestingService } from '../../../mocks/fake-translation-loader';
import assets_en from '../../../assets/i18n/en.json';
import assets_pl from '../../../assets/i18n/pl.json';

describe('AccountFilter', () => {
  let component: AccountFilter;
  let fixture: ComponentFixture<AccountFilter>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AccountFilter],
      providers: [
        { provide: ActivatedRoute, useValue: mockRoute },
        { provide: AccountsStore, useValue: mockAccountsStore },
        provideTranslateTestingService({
          en: assets_en,
          pl: assets_pl,
        }),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AccountFilter);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render page in english (default)', () => {
    testComponentTranslation(AccountFilter, 'en', '#userLabel', 'User');
  });

  it('should render page in proper language', () => {
    testComponentTranslation(AccountFilter, 'pl', '#userLabel', 'Użytkownik');
  });
});
