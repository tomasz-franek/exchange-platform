import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StatisticMenu } from './statistic-menu';
import { testComponentTranslation } from '../../../mocks/test-functions';
import { MenuComponent } from '../../menu/menu.component';
import Keycloak from 'keycloak-js';
import { MockKeycloak } from '../../../mocks/mock-keycloak';
import { KEYCLOAK_EVENT_SIGNAL } from 'keycloak-angular';
import { MOCK_KEYCLOAK_EVENT_SIGNAL } from '../../../mocks/mock-keycloak-signal';
import { ActivatedRoute } from '@angular/router';
import { mockRoute } from '../../../mocks/activated-route-mock';
import { PropertyStore } from '../../properties/properties.signal-store';
import { mockPropertyStore } from '../../../mocks/mock-store';
import { provideTranslateTestingService } from '../../../mocks/fake-translation-loader';
import assets_en from '../../../assets/i18n/en.json';
import assets_pl from '../../../assets/i18n/pl.json';

describe('StatisticMenu', () => {
  let component: StatisticMenu;
  let fixture: ComponentFixture<StatisticMenu>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [StatisticMenu, MenuComponent],
      providers: [
        { provide: Keycloak, useClass: MockKeycloak },
        {
          provide: KEYCLOAK_EVENT_SIGNAL,
          useValue: MOCK_KEYCLOAK_EVENT_SIGNAL,
        },
        { provide: ActivatedRoute, useValue: mockRoute },
        { provide: PropertyStore, useValue: mockPropertyStore },
        provideTranslateTestingService({
          en: assets_en,
          pl: assets_pl,
        }),
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
