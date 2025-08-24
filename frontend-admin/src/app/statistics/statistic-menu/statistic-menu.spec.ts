import {ComponentFixture, TestBed} from '@angular/core/testing';

import {StatisticMenu} from './statistic-menu';
import {checkMenuChecked, testComponentTranslation, testTranslations,} from '../../../mocks/test-functions';

describe('StatisticMenu', () => {
  let component: StatisticMenu;
  let fixture: ComponentFixture<StatisticMenu>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StatisticMenu, testTranslations()],
    }).compileComponents();

    fixture = TestBed.createComponent(StatisticMenu);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render page in english (default)', () => {
    testComponentTranslation(fixture, 'en', '#labelStatisticTransactions', 'Transactions');
  });

  it('should render page in proper language', () => {
    testComponentTranslation(fixture, 'pl', '#labelStatisticTransactions', 'Transakcje');
  });

  [
    {id: 'statisticTransactions', description: 'Statistic Transactions'},
  ].forEach(({id, description}) => {
    it(`should check the menu option ${description} when clicked`, () => {
      checkMenuChecked(fixture, `#${id}`);
    });
  });
});
