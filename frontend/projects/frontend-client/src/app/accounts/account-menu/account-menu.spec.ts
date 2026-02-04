import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountMenu } from './account-menu';
import { ActivatedRoute } from '@angular/router';
import { mockRoute } from '../../../mocks/mock-activated-route';
import { testComponentTranslation } from '../../../mocks/test-functions';
import { PropertyStore } from '../../properties/properties.signal-store';
import { mockPropertyStore } from '../../../mocks/mock-store';
import { provideTranslateTestingService } from '../../../mocks/fake-translation-loader';
import assets_en from '../../../assets/i18n/en.json';
import assets_pl from '../../../assets/i18n/pl.json';

describe('AccountMenu', () => {
  let component: AccountMenu;
  let fixture: ComponentFixture<AccountMenu>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AccountMenu],
      providers: [
        { provide: ActivatedRoute, useValue: mockRoute },
        { provide: PropertyStore, useValue: mockPropertyStore },
        provideTranslateTestingService({
          en: assets_en,
          pl: assets_pl,
        }),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AccountMenu);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render page in english (default)', () => {
    testComponentTranslation(AccountMenu, 'en', '#accountList', 'Account List');
  });

  it('should render page in proper language', () => {
    testComponentTranslation(AccountMenu, 'pl', '#accountList', 'Lista kont');
  });

  // [
  //   {id: 'accountList', description: 'Account List'},
  //   {id: 'addAccount', description: 'Add account'},
  //   {id: 'withdraw', description: 'Withdraw'},
  // ].forEach(({id, description}) => {
  //   it(`should check the menu option ${description} when clicked`, () => {
  //     checkMenuChecked(fixture, `#${id}`);
  //   });
  // });
});
