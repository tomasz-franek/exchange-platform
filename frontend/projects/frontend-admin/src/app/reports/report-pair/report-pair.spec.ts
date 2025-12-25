import {ComponentFixture, TestBed} from '@angular/core/testing';

import {ReportPair} from './report-pair';
import Keycloak from 'keycloak-js';
import {MockKeycloak} from '../../../mocks/mock-keycloak';
import {KEYCLOAK_EVENT_SIGNAL} from 'keycloak-angular';
import {MOCK_KEYCLOAK_EVENT_SIGNAL} from '../../../mocks/mock-keycloak-signal';
import {ActivatedRoute} from '@angular/router';
import {mockRoute} from '../../../mocks/activated-route-mock';
import {MenuComponent} from '../../menu/menu.component';
import {testComponentTranslation, testTranslations} from '../../../mocks/test-functions';
import {ReportStore} from '../reports.signal-store';
import {mockReportStore} from '../../../mocks/mock-store';
import {RatioRange} from '../../../../../shared-modules/src/lib/ratio-range/ratio-range';

describe('ReportPairs', () => {
  let component: ReportPair;
  let fixture: ComponentFixture<ReportPair>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReportPair, RatioRange, MenuComponent, testTranslations()],
      providers: [
        {provide: Keycloak, useClass: MockKeycloak},
        {
          provide: KEYCLOAK_EVENT_SIGNAL,
          useValue: MOCK_KEYCLOAK_EVENT_SIGNAL,
        },
        {provide: ReportStore, useValue: mockReportStore},
        {provide: ActivatedRoute, useValue: mockRoute},
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ReportPair);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render page in english (default)', () => {
    testComponentTranslation(ReportPair, 'en', '#labelPair', 'Exchange Pair');
  });

  it('should render page in proper language', () => {
    testComponentTranslation(ReportPair, 'pl', '#labelPair', 'Para walutowa');
  });
});
