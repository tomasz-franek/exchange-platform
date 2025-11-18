import {ComponentFixture, TestBed} from '@angular/core/testing';

import {PropertyAddressComponent} from './property-address.component';
import {ActivatedRoute} from '@angular/router';
import {mockRoute} from '../../../mocks/mock-activated-route';
import Keycloak from 'keycloak-js';
import {MockKeycloak} from '../../../mocks/mock-keycloak';
import {KEYCLOAK_EVENT_SIGNAL} from 'keycloak-angular';
import {MOCK_KEYCLOAK_EVENT_SIGNAL} from '../../../mocks/mock-keycloak-signal';
import {testComponentTranslation, testTranslations,} from '../../../mocks/test-functions';
import {propertyStore} from '../properties.signal-store';
import {mockPropertyStore} from '../../../mocks/mock-store';

describe('PropertyAddressComponent', () => {
  let component: PropertyAddressComponent;
  let fixture: ComponentFixture<PropertyAddressComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PropertyAddressComponent, testTranslations()],
      providers: [
        {provide: ActivatedRoute, useValue: mockRoute},
        {provide: propertyStore, useValue: mockPropertyStore},
        {
          provide: KEYCLOAK_EVENT_SIGNAL,
          useValue: MOCK_KEYCLOAK_EVENT_SIGNAL,
        },
        {provide: Keycloak, useClass: MockKeycloak},
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(PropertyAddressComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render page in english (default)', () => {
    testComponentTranslation(PropertyAddressComponent, 'en', '#nameInputLabel', 'Company name');
  });

  it('should render page in proper language', () => {
    testComponentTranslation(PropertyAddressComponent, 'pl', '#nameInputLabel', 'Nazwa firmy');
  });
});
