import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransactionMenu } from './transaction-menu';
import { ActivatedRoute } from '@angular/router';
import { mockRoute } from '../../../mocks/activated-route-mock';
import { TranslateService } from '@ngx-translate/core';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import {
  checkMenuChecked,
  testTranslations,
} from '../../../mocks/test-functions';

describe('TransactionMenu', () => {
  let component: TransactionMenu;
  let fixture: ComponentFixture<TransactionMenu>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TransactionMenu, testTranslations()],
      providers: [{ provide: ActivatedRoute, useValue: mockRoute }],
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
    const translateService = TestBed.inject(TranslateService);
    translateService.setDefaultLang('en');
    const fixture = TestBed.createComponent(TransactionMenu);

    fixture.detectChanges();
    const idElement: HTMLElement = fixture.nativeElement.querySelector(
      '#labelTransactionList',
    );
    expect(idElement.innerText).toContain('Transaction List');
  });

  it('should render page in proper language', () => {
    const fixture = TestBed.createComponent(TransactionMenu);

    const translateService = TestBed.inject(TranslateService);
    translateService.use('pl');

    fixture.detectChanges();
    const idElement: HTMLElement = fixture.nativeElement.querySelector(
      '#labelTransactionList',
    );
    expect(idElement.innerText).toContain('Lista transakcji');
  });

  [{ id: 'transactionList', description: 'Transaction List' }].forEach(
    ({ id, description }) => {
      it(`should check the menu option ${description} when clicked`, () => {
        checkMenuChecked(fixture, `#${id}`);
      });
    },
  );
});
