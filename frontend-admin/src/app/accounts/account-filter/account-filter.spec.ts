import {ComponentFixture, TestBed} from '@angular/core/testing';

import {AccountFilter} from './account-filter';
import {ActivatedRoute} from '@angular/router';
import {mockRoute} from '../../../mocks/activated-route-mock';
import {provideMockStore} from '@ngrx/store/testing';
import {initialAccountState} from '../state/account.reducers';
import {testComponentTranslation, testTranslations} from '../../../mocks/test-functions';

describe('AccountFilter', () => {
  let component: AccountFilter;
  let fixture: ComponentFixture<AccountFilter>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AccountFilter, testTranslations()],
      providers: [
        {provide: ActivatedRoute, useValue: mockRoute},
        provideMockStore({initialState: initialAccountState}),
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
    testComponentTranslation(fixture, 'en', '#userLabel', 'User');
  });

  it('should render page in proper language', () => {
    testComponentTranslation(fixture, 'pl', '#userLabel', 'Użytkownik');
  });
});
