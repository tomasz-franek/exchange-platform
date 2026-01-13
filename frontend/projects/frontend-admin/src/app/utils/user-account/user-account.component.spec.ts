import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserAccountComponent } from './user-account.component';
import {
  testComponentTranslation,
  testTranslations,
} from '../../../mocks/test-functions';
import { ActivatedRoute } from '@angular/router';
import { mockRoute } from '../../../mocks/activated-route-mock';
import { AccountsStore } from '../../accounts/accounts.signal-store';
import { mockAccountsStore } from '../../../mocks/mock-store';
import { beforeEach, describe, expect, it } from 'vitest';

describe('UserAccountComponent', () => {
  let component: UserAccountComponent;
  let fixture: ComponentFixture<UserAccountComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserAccountComponent, testTranslations()],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: mockRoute,
        },
        { provide: AccountsStore, useValue: mockAccountsStore },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(UserAccountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render page in english (default)', () => {
    testComponentTranslation(
      UserAccountComponent,
      'en',
      '#userAccountLabel',
      'Accounts list',
    );
  });

  it('should render page in proper language', () => {
    testComponentTranslation(
      UserAccountComponent,
      'pl',
      '#userAccountLabel',
      'Lista kont',
    );
  });
});
