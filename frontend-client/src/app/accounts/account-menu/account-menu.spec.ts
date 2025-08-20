import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountMenu } from './account-menu';
import { TranslateTestingModule } from 'ngx-translate-testing';
import assets_en from '../../../assets/i18n/en.json';
import assets_pl from '../../../assets/i18n/pl.json';
import { TranslateService } from '@ngx-translate/core';
import { ActivatedRoute } from '@angular/router';
import { mockRoute } from '../../../mocks/mock-activated-route';
import { By } from '@angular/platform-browser';

describe('AccountMenu', () => {
  let component: AccountMenu;
  let fixture: ComponentFixture<AccountMenu>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        AccountMenu,
        TranslateTestingModule.withTranslations(
          'en',
          assets_en
        ).withTranslations('pl', assets_pl)
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
      const radioButton = fixture.debugElement.query(By.css(`#${id}`));
      radioButton.nativeElement.click();
      fixture.detectChanges();
      const isChecked = fixture.nativeElement.querySelector(`#${id}`).checked;
      expect(isChecked).toBeTrue();
    });
  });
});
