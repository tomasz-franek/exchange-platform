import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportMenu } from './report-menu';
import { ActivatedRoute } from '@angular/router';
import { mockRoute } from '../../../mocks/activated-route-mock';
import {
  testComponentTranslation,
  testTranslations,
} from '../../../mocks/test-functions';
import { PropertyStore } from '../../properties/properties.signal-store';
import { mockPropertyStore } from '../../../mocks/mock-store';

describe('ReportMenu', () => {
  let component: ReportMenu;
  let fixture: ComponentFixture<ReportMenu>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReportMenu, testTranslations()],
      providers: [
        { provide: ActivatedRoute, useValue: mockRoute },
        { provide: PropertyStore, useValue: mockPropertyStore },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ReportMenu);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render page in english (default)', () => {
    testComponentTranslation(
      ReportMenu,
      'en',
      '#reportTransactionList',
      'Transaction List',
    );
  });

  it('should render page in proper language', () => {
    testComponentTranslation(
      ReportMenu,
      'pl',
      '#reportTransactionList',
      'Raport listy transakcji',
    );
  });

  // [
  //   {id: 'reportTransactionList', description: 'Report Transaction List'},
  //   {id: 'reportErrorList', description: 'Report Error List'},
  //   {id: 'reportPairs', description: 'Report Pairs'},
  // ].forEach(({id, description}) => {
  //   it(`should check the menu option ${description} when clicked`, () => {
  //     checkMenuChecked(fixture, `#${id}`);
  //   });
  // });
});
