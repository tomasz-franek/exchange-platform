import {ComponentFixture, TestBed} from '@angular/core/testing';

import {PropertySettingsComponent} from './property-settings';
import {ActivatedRoute} from '@angular/router';
import {mockRoute} from '../../../mocks/activated-route-mock';
import Keycloak from 'keycloak-js';
import {MockKeycloak} from '../../../mocks/mock-keycloak';
import {KEYCLOAK_EVENT_SIGNAL} from 'keycloak-angular';
import {MOCK_KEYCLOAK_EVENT_SIGNAL} from '../../../mocks/mock-keycloak-signal';
import {testComponentTranslation} from '../../../mocks/test-functions';
import {PropertyStore} from '../properties.signal-store';
import {mockPropertyStore} from '../../../mocks/mock-store';
import {provideTranslateTestingService} from '../../../mocks/fake-translation-loader';
import assets_en from '../../../assets/i18n/en.json';
import assets_pl from '../../../assets/i18n/pl.json';
import assets_es from '../../../assets/i18n/es.json';
import assets_hi from '../../../assets/i18n/hi.json';
import assets_zhcn from '../../../assets/i18n/zhcn.json';

describe('PropertySettingsComponent', () => {
  let component: PropertySettingsComponent;
  let fixture: ComponentFixture<PropertySettingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PropertySettingsComponent],
      providers: [
        { provide: ActivatedRoute, useValue: mockRoute },
        { provide: PropertyStore, useValue: mockPropertyStore },
        { provide: Keycloak, useClass: MockKeycloak },
        {
          provide: KEYCLOAK_EVENT_SIGNAL,
          useValue: MOCK_KEYCLOAK_EVENT_SIGNAL,
        },
        provideTranslateTestingService({
          en: assets_en,
          pl: assets_pl,
          es: assets_es,
          hi: assets_hi,
          zhcn: assets_zhcn,
        }),
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
    testComponentTranslation(PropertySettingsComponent, 'en', '#save', 'Save');
  });

  it('should render page in proper language Polish', () => {
    testComponentTranslation(
      PropertySettingsComponent,
      'pl',
      '#save',
      'Zapisz',
    );
  });

  it('should render page in proper language Spanish', () => {
    testComponentTranslation(
      PropertySettingsComponent,
      'es',
      '#save',
      'Guardar',
    );
  });

  it('should render page in proper language Hindi', () => {
    testComponentTranslation(
      PropertySettingsComponent,
      'hi',
      '#save',
      'सहेजें',
    );
  });

  it('should render page in proper language Chinese', () => {
    testComponentTranslation(
      PropertySettingsComponent,
      'zhcn',
      '#save',
      '保存',
    );
  });
});
