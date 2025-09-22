import {ComponentFixture, TestBed} from '@angular/core/testing';

import {PropertyCurrency} from './property-currency';
import {testComponentTranslation, testTranslations} from '../../../mocks/test-functions';
import {ActivatedRoute} from '@angular/router';
import {mockRoute} from '../../../mocks/activated-route-mock';
import {provideMockStore} from '@ngrx/store/testing';
import {initialPropertyState} from '../state/properties.reducers';
import Keycloak from 'keycloak-js';
import {MockKeycloak} from '../../../mocks/mock-keycloak';
import {KEYCLOAK_EVENT_SIGNAL} from 'keycloak-angular';
import {MOCK_KEYCLOAK_EVENT_SIGNAL} from '../../../mocks/mock-keycloak-signal';

describe('PropertyCurrency', () => {
  let component: PropertyCurrency;
  let fixture: ComponentFixture<PropertyCurrency>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PropertyCurrency, testTranslations()],
      providers: [
        {provide: ActivatedRoute, useValue: mockRoute},
        provideMockStore({initialState: initialPropertyState}),
        {provide: Keycloak, useClass: MockKeycloak},
        {
          provide: KEYCLOAK_EVENT_SIGNAL,
          useValue: MOCK_KEYCLOAK_EVENT_SIGNAL,
        },
      ],
    })
      .compileComponents();

    fixture = TestBed.createComponent(PropertyCurrency);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });


  it('should render page in english (default)', () => {
    testComponentTranslation(fixture, 'en', '#minimumCurrencyAmountLabel', 'Minimum Currency Amount For Exchange');
  });

  it('should render page in proper language', () => {
    testComponentTranslation(fixture, 'pl', '#minimumCurrencyAmountLabel', 'Minimalna ilość waluty do wymiany');
  });
});
