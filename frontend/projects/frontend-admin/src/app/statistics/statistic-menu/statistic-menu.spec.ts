import {ComponentFixture, TestBed} from '@angular/core/testing';

import {StatisticMenu} from './statistic-menu';
import {testComponentTranslation, testTranslations,} from '../../../mocks/test-functions';
import {MenuComponent} from '../../menu/menu.component';
import Keycloak from 'keycloak-js';
import {MockKeycloak} from '../../../mocks/mock-keycloak';
import {KEYCLOAK_EVENT_SIGNAL} from 'keycloak-angular';
import {MOCK_KEYCLOAK_EVENT_SIGNAL} from '../../../mocks/mock-keycloak-signal';
import {ActivatedRoute} from '@angular/router';
import {mockRoute} from '../../../mocks/activated-route-mock';

describe('StatisticMenu', () => {
  let component: StatisticMenu;
  let fixture: ComponentFixture<StatisticMenu>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StatisticMenu, MenuComponent, testTranslations()],
      providers: [
        {provide: Keycloak, useClass: MockKeycloak},
        {
          provide: KEYCLOAK_EVENT_SIGNAL,
          useValue: MOCK_KEYCLOAK_EVENT_SIGNAL,
        },
        {provide: ActivatedRoute, useValue: mockRoute},
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(StatisticMenu);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render page in english (default)', () => {
    testComponentTranslation(
      StatisticMenu,
      'en',
      '#statisticsTransaction',
      'Transactions',
    );
  });

  it('should render page in proper language', () => {
    testComponentTranslation(
      StatisticMenu,
      'pl',
      '#statisticsTransaction',
      'Transakcje',
    );
  });

  // [
  //   {id: 'statisticsTransaction', description: 'Statistic Transactions'},
  //   {id: 'statisticCurrency', description: 'Statistic Currency'},
  //   {id: 'statisticsPair', description: 'Statistic Pair'},
  //   {id: 'statisticsUser', description: 'Statistic User'},
  // ].forEach(({id, description}) => {
  //   it(`should check the menu option ${description} when clicked`, () => {
  //     checkMenuChecked(fixture, `#${id}`);
  //   });
  // });
});
