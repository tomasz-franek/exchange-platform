import {ComponentFixture, TestBed} from '@angular/core/testing';

import {UserOperationListComponent} from './user-operation-list.component';
import {testComponentTranslation, testTranslations,} from '../../../mocks/test-functions';
import {AccountsStore} from '../accounts.signal-store';
import {mockAccountsStore} from '../../../mocks/mock-store';

describe('UserOperationListComponent', () => {
  let component: UserOperationListComponent;
  let fixture: ComponentFixture<UserOperationListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserOperationListComponent, testTranslations()],
      providers: [{provide: AccountsStore, useValue: mockAccountsStore}],
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
