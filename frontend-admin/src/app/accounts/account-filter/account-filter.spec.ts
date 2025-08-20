import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountFilter } from './account-filter';
import { TranslateService } from '@ngx-translate/core';
import { ActivatedRoute } from '@angular/router';
import { mockRoute } from '../../../mocks/activated-route-mock';
import { provideMockStore } from '@ngrx/store/testing';
import { initialAccountState } from '../state/account.reducers';
import { testTranslations } from '../../../mocks/test-functions';

describe('AccountFilter', () => {
  let component: AccountFilter;
  let fixture: ComponentFixture<AccountFilter>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AccountFilter, testTranslations()],
      providers: [
        { provide: ActivatedRoute, useValue: mockRoute },
        provideMockStore({ initialState: initialAccountState }),
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
    const translateService = TestBed.inject(TranslateService);
    translateService.setDefaultLang('en');
    const fixture = TestBed.createComponent(AccountFilter);

    fixture.detectChanges();
    const idElement: HTMLElement =
      fixture.nativeElement.querySelector('#userLabel');
    expect(idElement.innerText).toContain('User');
  });

  it('should render page in proper language', () => {
    const fixture = TestBed.createComponent(AccountFilter);

    const translateService = TestBed.inject(TranslateService);
    translateService.use('pl');

    fixture.detectChanges();
    const idElement: HTMLElement =
      fixture.nativeElement.querySelector('#userLabel');
    expect(idElement.innerText).toContain('Użytkownik');
  });
});
