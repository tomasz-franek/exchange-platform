import {ComponentFixture, TestBed} from '@angular/core/testing';

import {PropertySettingsComponent} from './property-settings';
import {TranslateService} from '@ngx-translate/core';
import {ActivatedRoute} from '@angular/router';
import {mockRoute} from '../../../mocks/activated-route-mock';
import {TranslateTestingModule} from 'ngx-translate-testing';
import assets_en from '../../../assets/i18n/en.json';
import assets_pl from '../../../assets/i18n/pl.json';
import {provideMockStore} from '@ngrx/store/testing';
import {initialPropertyState} from '../state/properties.reducers';
import Keycloak from 'keycloak-js';
import {MockKeycloak} from '../../../mocks/mock-keycloak';
import {KEYCLOAK_EVENT_SIGNAL} from 'keycloak-angular';
import {MOCK_KEYCLOAK_EVENT_SIGNAL} from '../../../mocks/mock-keycloak-signal';

describe('PropertySettingsComponent', () => {
  let component: PropertySettingsComponent;
  let fixture: ComponentFixture<PropertySettingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PropertySettingsComponent,
        TranslateTestingModule.withTranslations(
          'en',
          assets_en,
        ).withTranslations('pl', assets_pl),
      ],
      providers: [
        {provide: ActivatedRoute, useValue: mockRoute},
        provideMockStore({initialState: initialPropertyState}),
        {provide: Keycloak, useClass: MockKeycloak},
        {provide: KEYCLOAK_EVENT_SIGNAL, useValue: MOCK_KEYCLOAK_EVENT_SIGNAL}
      ],
    })
    .compileComponents();

    fixture = TestBed.createComponent(PropertySettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should render page in english (default)', () => {
    const translateService = TestBed.inject(TranslateService);
    translateService.setDefaultLang('en');
    const fixture = TestBed.createComponent(PropertySettingsComponent);
    fixture.detectChanges();
    const idElement: HTMLElement = fixture.nativeElement.querySelector('#save');
    expect(idElement.innerText).toContain('Save');
  });

  it('should render page in proper language', () => {
    const fixture = TestBed.createComponent(PropertySettingsComponent);

    const translateService = TestBed.inject(TranslateService);
    translateService.use('pl');

    fixture.detectChanges();
    const idElement: HTMLElement = fixture.nativeElement.querySelector('#save');
    expect(idElement.innerText).toContain('Zapisz');
  });
});
