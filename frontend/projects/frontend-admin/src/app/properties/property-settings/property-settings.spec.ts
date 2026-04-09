import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PropertySettingsComponent } from './property-settings';
import { ActivatedRoute } from '@angular/router';
import { mockRoute } from '../../../mocks/activated-route-mock';
import Keycloak from 'keycloak-js';
import { MockKeycloak } from '../../../mocks/mock-keycloak';
import { KEYCLOAK_EVENT_SIGNAL } from 'keycloak-angular';
import { MOCK_KEYCLOAK_EVENT_SIGNAL } from '../../../mocks/mock-keycloak-signal';
import { testComponentTranslation } from '../../../mocks/test-functions';
import { PropertyStore } from '../properties.signal-store';
import { mockPropertyStore } from '../../../mocks/mock-store';
import { provideTranslateTestingService } from '../../../mocks/fake-translation-loader';
import assets_en from '../../../assets/i18n/en.json';
import assets_pl from '../../../assets/i18n/pl.json';
import assets_es from '../../../assets/i18n/es.json';
import assets_fr from '../../../assets/i18n/fr.json';
import assets_hi from '../../../assets/i18n/hi.json';
import assets_zhcn from '../../../assets/i18n/zhcn.json';
import assets_de from '../../../assets/i18n/de.json';
import assets_pt from '../../../assets/i18n/pt.json';
import { MessageService } from 'primeng/api';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';

describe('PropertySettingsComponent', () => {
  let component: PropertySettingsComponent;
  let fixture: ComponentFixture<PropertySettingsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [PropertySettingsComponent],
      providers: [
        FormBuilder,
        MessageService,
        ReactiveFormsModule,
        { provide: ActivatedRoute, useValue: mockRoute },
        { provide: PropertyStore, useValue: mockPropertyStore },
        { provide: Keycloak, useClass: MockKeycloak },
        {
          provide: KEYCLOAK_EVENT_SIGNAL,
          useValue: MOCK_KEYCLOAK_EVENT_SIGNAL,
        },
        provideTranslateTestingService({
          de: assets_de,
          en: assets_en,
          es: assets_es,
          fr: assets_fr,
          hi: assets_hi,
          pl: assets_pl,
          pt: assets_pt,
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
  it('should render page in proper language French', () => {
    testComponentTranslation(
      PropertySettingsComponent,
      'fr',
      '#save',
      'Enregistrer',
    );
  });
  it('should render page in proper language German', () => {
    testComponentTranslation(
      PropertySettingsComponent,
      'de',
      '#save',
      'Speichern',
    );
  });
  it('should render page in proper language Portuguese', () => {
    testComponentTranslation(
      PropertySettingsComponent,
      'pt',
      '#save',
      'Salvar',
    );
  });
});
