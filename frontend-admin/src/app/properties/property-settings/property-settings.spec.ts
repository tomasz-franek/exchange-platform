import {ComponentFixture, TestBed} from '@angular/core/testing';

import {PropertySettingsComponent} from './property-settings';
import {ActivatedRoute} from '@angular/router';
import {mockRoute} from '../../../mocks/activated-route-mock';
import {provideMockStore} from '@ngrx/store/testing';
import {initialPropertyState} from '../state/properties.reducers';
import Keycloak from 'keycloak-js';
import {MockKeycloak} from '../../../mocks/mock-keycloak';
import {KEYCLOAK_EVENT_SIGNAL} from 'keycloak-angular';
import {MOCK_KEYCLOAK_EVENT_SIGNAL} from '../../../mocks/mock-keycloak-signal';
import {testComponentTranslation, testTranslations} from '../../../mocks/test-functions';

describe('PropertySettingsComponent', () => {
  let component: PropertySettingsComponent;
  let fixture: ComponentFixture<PropertySettingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PropertySettingsComponent, testTranslations()],
      providers: [
        {provide: ActivatedRoute, useValue: mockRoute},
        provideMockStore({initialState: initialPropertyState}),
        {provide: Keycloak, useClass: MockKeycloak},
        {
          provide: KEYCLOAK_EVENT_SIGNAL,
          useValue: MOCK_KEYCLOAK_EVENT_SIGNAL,
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(PropertySettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should render page in english (default)', () => {
    testComponentTranslation(fixture, 'en', '#save', 'Save');
  });

  it('should render page in proper language Polish', () => {
    testComponentTranslation(fixture, 'pl', '#save', 'Zapisz');
  });

  it('should render page in proper language Spanish', () => {
    testComponentTranslation(fixture, 'es', '#save', 'Guardar');
  });

  it('should render page in proper language Hindi', () => {
    testComponentTranslation(fixture, 'hi', '#save', 'सहेजें');
  });
});
