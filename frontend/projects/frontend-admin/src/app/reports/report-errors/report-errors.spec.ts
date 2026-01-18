import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportErrors } from './report-errors';
import { testTranslations } from '../../../mocks/test-functions';
import Keycloak from 'keycloak-js';
import { MockKeycloak } from '../../../mocks/mock-keycloak';
import { KEYCLOAK_EVENT_SIGNAL } from 'keycloak-angular';
import { MOCK_KEYCLOAK_EVENT_SIGNAL } from '../../../mocks/mock-keycloak-signal';
import { ActivatedRoute } from '@angular/router';
import { mockRoute } from '../../../mocks/activated-route-mock';
import { ReportStore } from '../reports.signal-store';
import { mockPropertyStore, mockReportStore } from '../../../mocks/mock-store';
import { PropertyStore } from '../../properties/properties.signal-store';

describe('ReportErrors', () => {
  let component: ReportErrors;
  let fixture: ComponentFixture<ReportErrors>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReportErrors, testTranslations()],
      providers: [
        { provide: ActivatedRoute, useValue: mockRoute },
        { provide: PropertyStore, useValue: mockPropertyStore },
        { provide: Keycloak, useClass: MockKeycloak },
        {
          provide: KEYCLOAK_EVENT_SIGNAL,
          useValue: MOCK_KEYCLOAK_EVENT_SIGNAL,
        },
        { provide: ReportStore, useValue: mockReportStore },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ReportErrors);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
