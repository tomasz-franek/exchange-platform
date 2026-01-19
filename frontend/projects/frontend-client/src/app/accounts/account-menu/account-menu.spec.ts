import {ComponentFixture, TestBed} from '@angular/core/testing';

import {AccountMenu} from './account-menu';
import {ActivatedRoute} from '@angular/router';
import {mockRoute} from '../../../mocks/mock-activated-route';
import {testComponentTranslation, testTranslations,} from '../../../mocks/test-functions';
import {PropertyStore} from '../../properties/properties.signal-store';
import {mockPropertyStore} from '../../../mocks/mock-store';

describe('AccountMenu', () => {
  let component: AccountMenu;
  let fixture: ComponentFixture<AccountMenu>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AccountMenu, testTranslations()],
      providers: [
        { provide: ActivatedRoute, useValue: mockRoute },
        { provide: PropertyStore, useValue: mockPropertyStore },
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
