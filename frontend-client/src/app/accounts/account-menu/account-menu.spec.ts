import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountMenu } from './account-menu';
import { TranslateService } from '@ngx-translate/core';
import { ActivatedRoute } from '@angular/router';
import { mockRoute } from '../../../mocks/mock-activated-route';
import { checkMenuChecked, testTranslations } from '../../../mocks/test-functions';

describe('AccountMenu', () => {
  let component: AccountMenu;
  let fixture: ComponentFixture<AccountMenu>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        AccountMenu,
        testTranslations()
      ],
      providers: [{ provide: ActivatedRoute, useValue: mockRoute }]
    }).compileComponents();

    fixture = TestBed.createComponent(AccountMenu);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render page in english (default)', () => {
    const translateService = TestBed.inject(TranslateService);
    translateService.setDefaultLang('en');
    const fixture = TestBed.createComponent(AccountMenu);

    fixture.detectChanges();
    const idElement: HTMLElement =
      fixture.nativeElement.querySelector('#labelAccountList');
    expect(idElement.innerText).toContain('Account List');
  });

  it('should render page in proper language', () => {
    const fixture = TestBed.createComponent(AccountMenu);

    const translateService = TestBed.inject(TranslateService);
    translateService.use('pl');

    fixture.detectChanges();
    const idElement: HTMLElement =
      fixture.nativeElement.querySelector('#labelAccountList');
    expect(idElement.innerText).toContain('Lista kont');
  });

  [
    { id: 'accountList', description: 'Account List' },
    { id: 'addAccount', description: 'Add account' },
    { id: 'withdraw', description: 'Withdraw' }
  ].forEach(({ id, description }) => {
    it(`should check the menu option ${description} when clicked`, () => {
      checkMenuChecked(fixture, `#${id}`);
    });
  });
});
