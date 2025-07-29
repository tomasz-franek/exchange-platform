import {ComponentFixture, TestBed} from '@angular/core/testing';

import {AccountMenu} from './account-menu';
import {TranslateService} from "@ngx-translate/core";
import {TranslateTestingModule} from "ngx-translate-testing";
import assets_en from '../../../assets/i18n/en.json';
import assets_pl from '../../../assets/i18n/pl.json';
import {ActivatedRoute} from "@angular/router";
import {mockRoute} from '../../mocks/activated-route-mock';

describe('AccountMenu', () => {
  let component: AccountMenu;
  let fixture: ComponentFixture<AccountMenu>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        AccountMenu,
        TranslateTestingModule.withTranslations(
            'en',
            assets_en,
        ).withTranslations('pl', assets_pl),
      ],
      providers: [
        {provide: ActivatedRoute, useValue: mockRoute}
      ]
    })
    .compileComponents();

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
});
