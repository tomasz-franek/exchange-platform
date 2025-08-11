import {ComponentFixture, TestBed} from '@angular/core/testing';

import {AccountDepositComponent} from './account-deposit.component';
import {FormBuilder, ReactiveFormsModule} from '@angular/forms';
import {provideToastr} from 'ngx-toastr';
import {provideMockStore} from '@ngrx/store/testing';
import {TranslateTestingModule} from 'ngx-translate-testing';
import assets_en from '../../../assets/i18n/en.json';
import assets_pl from '../../../assets/i18n/pl.json';
import {TranslateService} from '@ngx-translate/core';
import {ActivatedRoute} from '@angular/router';
import {mockRoute} from '../../../mocks/activated-route-mock';
import {initialAccountState} from '../state/account.reducers';
import Keycloak from 'keycloak-js';
import {MockKeycloak} from '../../../mocks/mock-keycloak';
import {MOCK_KEYCLOAK_EVENT_SIGNAL} from '../../../mocks/mock-keycloak-signal';
import {KEYCLOAK_EVENT_SIGNAL} from 'keycloak-angular';

describe('AccountDepositComponent', () => {
  let component: AccountDepositComponent;
  let fixture: ComponentFixture<AccountDepositComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        AccountDepositComponent,
        TranslateTestingModule.withTranslations(
          'en',
          assets_en,
        ).withTranslations('pl', assets_pl),
      ],
      providers: [
        FormBuilder,
        ReactiveFormsModule,
        provideToastr(),
        provideMockStore({initialState: initialAccountState}),
        {provide: ActivatedRoute, useValue: mockRoute},
        {provide: Keycloak, useClass: MockKeycloak},
        {provide: KEYCLOAK_EVENT_SIGNAL, useValue: MOCK_KEYCLOAK_EVENT_SIGNAL}
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
    const translateService = TestBed.inject(TranslateService);
    translateService.setDefaultLang('en');
    const fixture = TestBed.createComponent(AccountDepositComponent);
    fixture.detectChanges();
    const idElement: HTMLElement =
      fixture.nativeElement.querySelector('#sendRequest');
    expect(idElement.innerText).toContain('Send order');
  });

  it('should render page in proper language', () => {
    const fixture = TestBed.createComponent(AccountDepositComponent);

    const translateService = TestBed.inject(TranslateService);
    translateService.use('pl');

    fixture.detectChanges();
    const idElement: HTMLElement =
      fixture.nativeElement.querySelector('#sendRequest');
    expect(idElement.innerText).toContain('Wyślij zlecenie');
  });

  it('should have a form group with required fields', () => {
    expect(component.formGroup.get('operation')).toBeTruthy();
    expect(component.formGroup.get('amount')).toBeTruthy();
    expect(component.formGroup.get('userAccountId')).toBeTruthy();
  });

  it('should validate operation field', () => {
    const operationControl = component.formGroup.get('operation');
    operationControl?.setValue('');
    expect(operationControl?.valid).toBeFalse();
    operationControl?.setValue('DEPOSIT');
    expect(operationControl?.valid).toBeTrue();
  });

  it('should validate amount field', () => {
    const valueControl = component.formGroup.get('amount');
    valueControl?.setValue(0);
    expect(valueControl?.valid).toBeFalse();
    valueControl?.setValue(-20);
    expect(valueControl?.valid).toBeFalse();
    valueControl?.setValue(0.01);
    expect(valueControl?.valid).toBeTrue();
  });

  it('should validate userAccountId field', () => {
    const currencyControl = component.formGroup.get('userAccountId');
    currencyControl?.setValue(null);
    expect(currencyControl?.valid).toBeFalse();
    currencyControl?.setValue('');
    expect(currencyControl?.valid).toBeFalse();
    currencyControl?.setValue('GBP');
    expect(currencyControl?.valid).toBeTrue();
  });

  it('should validate userId field', () => {
    const currencyControl = component.formGroup.get('userId');
    currencyControl?.setValue(null);
    expect(currencyControl?.valid).toBeFalse();
    currencyControl?.setValue('');
    expect(currencyControl?.valid).toBeFalse();
    currencyControl?.setValue('userId');
    expect(currencyControl?.valid).toBeTrue();
  });

  it('should validate form group', () => {
    component.formGroup.get('amount')?.setValue(0.01);
    component.formGroup.get('userAccountId')?.setValue('userAccountId');
    component.formGroup.get('operation')?.setValue('WITHDRAW');
    component.formGroup.get('userId')?.setValue('userId');
    expect(component.formGroup.valid).toBeTrue();
  });
});
