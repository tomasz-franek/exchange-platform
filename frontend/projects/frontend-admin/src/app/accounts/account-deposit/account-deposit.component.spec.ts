import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountDepositComponent } from './account-deposit.component';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { mockRoute } from '../../../mocks/activated-route-mock';
import Keycloak from 'keycloak-js';
import { MockKeycloak } from '../../../mocks/mock-keycloak';
import { MOCK_KEYCLOAK_EVENT_SIGNAL } from '../../../mocks/mock-keycloak-signal';
import { KEYCLOAK_EVENT_SIGNAL } from 'keycloak-angular';
import { testComponentTranslation } from '../../../mocks/test-functions';
import { UserAccount } from '../../api/model/userAccount';
import { AccountsStore } from '../accounts.signal-store';
import {
  mockAccountsStore,
  mockPropertyStore,
} from '../../../mocks/mock-store';
import { PropertyStore } from '../../properties/properties.signal-store';
import { provideTranslateTestingService } from '../../../mocks/fake-translation-loader';
import assets_en from '../../../assets/i18n/en.json';
import assets_pl from '../../../assets/i18n/pl.json';

describe('AccountDepositComponent', () => {
  let component: AccountDepositComponent;
  let fixture: ComponentFixture<AccountDepositComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AccountDepositComponent],
      providers: [
        FormBuilder,
        ReactiveFormsModule,
        { provide: AccountsStore, useValue: mockAccountsStore },
        { provide: PropertyStore, useValue: mockPropertyStore },
        { provide: ActivatedRoute, useValue: mockRoute },
        { provide: Keycloak, useClass: MockKeycloak },
        {
          provide: KEYCLOAK_EVENT_SIGNAL,
          useValue: MOCK_KEYCLOAK_EVENT_SIGNAL,
        },
        provideTranslateTestingService({
          en: assets_en,
          pl: assets_pl,
        }),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AccountDepositComponent);
    fixture.detectChanges();
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render page in english (default)', () => {
    testComponentTranslation(
      AccountDepositComponent,
      'en',
      '#sendRequest',
      'Send order',
    );
  });

  it('should render page in proper language', () => {
    testComponentTranslation(
      AccountDepositComponent,
      'pl',
      '#sendRequest',
      'Wyślij zlecenie',
    );
  });

  it('should have a form group with required fields', () => {
    expect(component.formGroup.get('operation')).toBeTruthy();
    expect(component.formGroup.get('amount')).toBeTruthy();
    expect(component.formGroup.get('userAccount')).toBeTruthy();
    expect(component.formGroup.get('currency')).toBeTruthy();
  });

  it('should validate operation field', () => {
    const operationControl = component.formGroup.get('operation');
    operationControl?.setValue('');
    expect(operationControl?.valid).toBeFalse();
    operationControl?.setValue('DEPOSIT');
    expect(operationControl?.valid).toBeTrue();
  });

  it('should validate amount field', () => {
    const amountControl = component.formGroup.get('amount');
    const correctAmount = component.formGroup.get('correctAmount');
    correctAmount?.setValue(true);
    amountControl?.setValue(0);
    expect(amountControl?.valid).toBeTrue();
    amountControl?.setValue(-20);
    expect(amountControl?.valid).toBeFalse();
    amountControl?.setValue(0.01);
    expect(amountControl?.valid).toBeTrue();
  });

  it('should validate userAccountId field', () => {
    const userAccountControl = component.formGroup.get('userAccount');
    userAccountControl?.setValue(null);
    expect(userAccountControl?.valid).toBeFalse();
    userAccountControl?.setValue('');
    expect(userAccountControl?.valid).toBeFalse();
    userAccountControl?.setValue({
      id: 'id',
      currency: 'CHF',
      version: 1,
    } as UserAccount);
    expect(userAccountControl?.valid).toBeTrue();
  });

  it('should validate currency field', () => {
    const currencyControl = component.formGroup.get('currency');
    currencyControl?.setValue(null);
    expect(currencyControl?.valid).toBeFalse();
    currencyControl?.setValue('');
    expect(currencyControl?.valid).toBeFalse();
    currencyControl?.setValue('EUR');
    expect(currencyControl?.valid).toBeTrue();
  });

  it('should validate form group', () => {
    component.formGroup.get('amount')?.setValue(0.01);
    component.formGroup.get('userAccount')?.setValue({
      id: 'id',
      currency: 'CHF',
      version: 1,
    } as UserAccount);
    component.formGroup.get('operation')?.setValue('WITHDRAW');
    component.formGroup.get('currency')?.setValue('currency');
    expect(component.formGroup.valid).toBeTrue();
  });
});
