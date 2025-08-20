import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StatisticMenu } from './statistic-menu';
import { TranslateService } from '@ngx-translate/core';
import {
  checkMenuChecked,
  testTranslations,
} from '../../../mocks/test-functions';

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
    const translateService = TestBed.inject(TranslateService);
    translateService.setDefaultLang('en');
    const fixture = TestBed.createComponent(StatisticMenu);

    fixture.detectChanges();
    const idElement: HTMLElement = fixture.nativeElement.querySelector(
      '#labelStatisticTransactions',
    );
    expect(idElement.innerText).toContain('Transactions');
  });

  it('should render page in proper language', () => {
    const fixture = TestBed.createComponent(StatisticMenu);

    const translateService = TestBed.inject(TranslateService);
    translateService.use('pl');

    fixture.detectChanges();
    const idElement: HTMLElement = fixture.nativeElement.querySelector(
      '#labelStatisticTransactions',
    );
    expect(idElement.innerText).toContain('Transakcje');
  });

  [
    { id: 'statisticTransactions', description: 'Statistic Transactions' },
  ].forEach(({ id, description }) => {
    it(`should check the menu option ${description} when clicked`, () => {
      checkMenuChecked(fixture, `#${id}`);
    });
  });
});
