import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PropertyAddressComponent } from './property-address.component';
import { ActivatedRoute, Router } from '@angular/router';
import { provideMockStore } from '@ngrx/store/testing';
import { initialPropertyState } from '../state/properties.reducers';
import { mockRoute } from '../../../mocks/mock-activated-route';
import Keycloak from 'keycloak-js';
import { MockKeycloak } from '../../../mocks/mock-keycloak';
import { KEYCLOAK_EVENT_SIGNAL } from 'keycloak-angular';
import { MOCK_KEYCLOAK_EVENT_SIGNAL } from '../../../mocks/mock-keycloak-signal';
import {
  testComponentTranslation,
  testTranslations,
} from '../../../mocks/test-functions';

describe('PropertyAddressComponent', () => {
  let component: PropertyAddressComponent;
  let fixture: ComponentFixture<PropertyAddressComponent>;
  let router: Router;

  beforeEach(async () => {
    const routerMock = {
      navigate: jasmine.createSpy('navigate'),
    };
    await TestBed.configureTestingModule({
      imports: [PropertyAddressComponent, testTranslations()],
      providers: [
        { provide: ActivatedRoute, useValue: mockRoute },
        provideMockStore({ initialState: initialPropertyState }),
        {
          provide: KEYCLOAK_EVENT_SIGNAL,
          useValue: MOCK_KEYCLOAK_EVENT_SIGNAL,
        },
        { provide: Keycloak, useClass: MockKeycloak },
        { provide: Router, useValue: routerMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(PropertyAddressComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render page in english (default)', () => {
    testComponentTranslation(fixture, 'en', '#nameInputLabel', 'Company name');
  });

  it('should render page in proper language', () => {
    testComponentTranslation(fixture, 'pl', '#nameInputLabel', 'Nazwa firmy');
  });

  it('should navigate to dashboard on calling backToDashboard', () => {
    component.backToDashboard();
    expect(router.navigate).toHaveBeenCalledWith(['dashboard']);
  });
});
