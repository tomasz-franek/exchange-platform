import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransactionMenu } from './transaction-menu';
import { ActivatedRoute } from '@angular/router';
import { mockRoute } from '../../../mocks/activated-route-mock';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { testComponentTranslation } from '../../../mocks/test-functions';
import { PropertyStore } from '../../properties/properties.signal-store';
import { mockPropertyStore } from '../../../mocks/mock-store';
import { provideTranslateTestingService } from '../../../mocks/fake-translation-loader';
import assets_en from '../../../assets/i18n/en.json';
import assets_pl from '../../../assets/i18n/pl.json';

describe('TransactionMenu', () => {
  let component: TransactionMenu;
  let fixture: ComponentFixture<TransactionMenu>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TransactionMenu],
      providers: [
        { provide: ActivatedRoute, useValue: mockRoute },
        { provide: PropertyStore, useValue: mockPropertyStore },
        provideTranslateTestingService({
          en: assets_en,
          pl: assets_pl,
        }),
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(TransactionMenu);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render page in english (default)', () => {
    testComponentTranslation(
      TransactionMenu,
      'en',
      '#transactionList',
      'Transaction List',
    );
  });

  it('should render page in proper language', () => {
    testComponentTranslation(
      TransactionMenu,
      'pl',
      '#transactionList',
      'Lista transakcji',
    );
  });

  // [
  //   {id: 'transactionList', description: 'Transaction List'},
  //   {id: 'transactionSystemAccountList', description: 'System Account List'},
  //   {id: 'transactionFeeAccountList', description: 'Fee Account List'},
  // ].forEach(({id, description}) => {
  //   it(`should check the menu option ${description} when clicked`, () => {
  //     checkMenuChecked(fixture, `#${id}`);
  //   });
  // });
});
