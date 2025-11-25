import {ComponentFixture, TestBed} from '@angular/core/testing';

import {PropertySystem} from './property-system';
import {testComponentTranslation, testTranslations,} from '../../../mocks/test-functions';
import {ActivatedRoute} from '@angular/router';
import {mockRoute} from '../../../mocks/activated-route-mock';
import Keycloak from 'keycloak-js';
import {MockKeycloak} from '../../../mocks/mock-keycloak';
import {KEYCLOAK_EVENT_SIGNAL} from 'keycloak-angular';
import {MOCK_KEYCLOAK_EVENT_SIGNAL} from '../../../mocks/mock-keycloak-signal';
import {mockPropertyStore} from '../../../mocks/mock-store';
import {PropertyStore} from '../properties.signal-store';

describe('PropertySystem', () => {
  let component: PropertySystem;
  let fixture: ComponentFixture<PropertySystem>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PropertySystem, testTranslations()],
      providers: [
        {provide: ActivatedRoute, useValue: mockRoute},
        {provide: PropertyStore, useValue: mockPropertyStore},
        {provide: Keycloak, useClass: MockKeycloak},
        {
          provide: KEYCLOAK_EVENT_SIGNAL,
          useValue: MOCK_KEYCLOAK_EVENT_SIGNAL,
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(PropertySystem);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render page in english (default)', () => {
    testComponentTranslation(
      PropertySystem,
      'en',
      '#ratioStrategyLabel',
      'Ratio strategy',
    );
  });

  it('should render page in proper language', () => {
    testComponentTranslation(
      PropertySystem,
      'pl',
      '#ratioStrategyLabel',
      'Strategia kursu wymiany',
    );
  });
});
