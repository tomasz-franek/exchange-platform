import {ComponentFixture, TestBed} from '@angular/core/testing';

import {UserAccountComponent} from './user-account.component';
import {testComponentTranslation, testTranslations} from '../../../mocks/test-functions';
import {ActivatedRoute} from '@angular/router';
import {mockRoute} from '../../../mocks/activated-route-mock';
import {provideMockStore} from '@ngrx/store/testing';
import {initialAccountState} from '../../accounts/state/account.reducers';

describe('UserAccountComponent', () => {
  let component: UserAccountComponent;
  let fixture: ComponentFixture<UserAccountComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserAccountComponent, testTranslations()],
      providers: [{
        provide: ActivatedRoute,
        useValue: mockRoute
      }, provideMockStore({initialState: initialAccountState}),
      ],
    })
      .compileComponents();

    fixture = TestBed.createComponent(UserAccountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render page in english (default)', () => {
    testComponentTranslation(UserAccountComponent, 'en', '#userAccountLabel', 'Accounts list');
  });

  it('should render page in proper language', () => {
    testComponentTranslation(UserAccountComponent, 'pl', '#userAccountLabel', 'Lista kont');
  });
});
