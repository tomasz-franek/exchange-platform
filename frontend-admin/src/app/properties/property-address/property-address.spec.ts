import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PropertyAddressComponent } from './property-address';
import { TranslateService } from '@ngx-translate/core';
import { ActivatedRoute } from '@angular/router';
import { mockRoute } from '../../../mocks/activated-route-mock';
import { provideMockStore } from '@ngrx/store/testing';
import { initialPropertyState } from '../state/properties.reducers';
import { MockKeycloak } from '../../../mocks/mock-keycloak';
import Keycloak from 'keycloak-js';
import { KEYCLOAK_EVENT_SIGNAL } from 'keycloak-angular';
import { MOCK_KEYCLOAK_EVENT_SIGNAL } from '../../../mocks/mock-keycloak-signal';
import { testTranslations } from '../../../mocks/test-functions';

describe('PropertyAddressComponent', () => {
  let component: PropertyAddressComponent;
  let fixture: ComponentFixture<PropertyAddressComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PropertyAddressComponent, testTranslations()],
      providers: [
        { provide: ActivatedRoute, useValue: mockRoute },
        provideMockStore({ initialState: initialPropertyState }),
        { provide: Keycloak, useClass: MockKeycloak },
        {
          provide: KEYCLOAK_EVENT_SIGNAL,
          useValue: MOCK_KEYCLOAK_EVENT_SIGNAL,
        },
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
    const translateService = TestBed.inject(TranslateService);
    translateService.setDefaultLang('en');
    const fixture = TestBed.createComponent(PropertyAddressComponent);
    fixture.detectChanges();
    const idElement: HTMLElement =
      fixture.nativeElement.querySelector('#nameInputLabel');
    expect(idElement.innerText).toContain('Company Name');
  });

  it('should render page in proper language', () => {
    const fixture = TestBed.createComponent(PropertyAddressComponent);

    const translateService = TestBed.inject(TranslateService);
    translateService.use('pl');

    fixture.detectChanges();
    const idElement: HTMLElement =
      fixture.nativeElement.querySelector('#nameInputLabel');
    expect(idElement.innerText).toContain('Nazwa firmy');
  });
});
