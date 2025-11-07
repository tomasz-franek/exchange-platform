import {ComponentFixture, TestBed} from '@angular/core/testing';

import {UserOperationListComponent} from './user-operation-list.component';
import {provideMockStore} from '@ngrx/store/testing';
import {initialAccountState} from '../state/account.reducers';
import {testComponentTranslation, testTranslations,} from '../../../mocks/test-functions';

describe('UserOperationListComponent', () => {
  let component: UserOperationListComponent;
  let fixture: ComponentFixture<UserOperationListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserOperationListComponent, testTranslations()],
      providers: [provideMockStore({initialState: initialAccountState})],
    }).compileComponents();

    fixture = TestBed.createComponent(UserOperationListComponent);
    fixture.detectChanges();
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render page in english (default)', () => {
    testComponentTranslation(UserOperationListComponent, 'en', '#amount', 'Amount');
  });

  it('should render page in proper language', () => {
    testComponentTranslation(UserOperationListComponent, 'pl', '#amount', 'Ilość');
  });
});
