import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportPair } from './report-pair';
import Keycloak from 'keycloak-js';
import { MockKeycloak } from '../../../mocks/mock-keycloak';
import { KEYCLOAK_EVENT_SIGNAL } from 'keycloak-angular';
import { MOCK_KEYCLOAK_EVENT_SIGNAL } from '../../../mocks/mock-keycloak-signal';
import { ActivatedRoute } from '@angular/router';
import { mockRoute } from '../../../mocks/activated-route-mock';
import { MenuComponent } from '../../menu/menu.component';
import { testComponentTranslation } from '../../../mocks/test-functions';
import { ReportStore } from '../reports.signal-store';
import { mockPropertyStore, mockReportStore } from '../../../mocks/mock-store';
import { RatioRange } from 'shared-modules';
import { PropertyStore } from '../../properties/properties.signal-store';
import { provideTranslateTestingService } from '../../../mocks/fake-translation-loader';
import assets_en from '../../../assets/i18n/en.json';
import assets_pl from '../../../assets/i18n/pl.json';

describe('ReportPairs', () => {
  let component: ReportPair;
  let fixture: ComponentFixture<ReportPair>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReportPair, RatioRange, MenuComponent],
      providers: [
        { provide: Keycloak, useClass: MockKeycloak },
        {
          provide: KEYCLOAK_EVENT_SIGNAL,
          useValue: MOCK_KEYCLOAK_EVENT_SIGNAL,
        },
        { provide: ReportStore, useValue: mockReportStore },
        { provide: PropertyStore, useValue: mockPropertyStore },
        { provide: ActivatedRoute, useValue: mockRoute },
        provideTranslateTestingService({
          en: assets_en,
          pl: assets_pl,
        }),
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
