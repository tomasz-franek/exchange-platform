import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserPropertyComponent } from './user-property.component';
import { ActivatedRoute } from '@angular/router';
import { mockRoute } from '../../../mocks/mock-activated-route';
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
import assets_hi from '../../../assets/i18n/hi.json';
import assets_zhcn from '../../../assets/i18n/zhcn.json';

describe('UserPropertyComponent', () => {
  let component: UserPropertyComponent;
  let fixture: ComponentFixture<UserPropertyComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [UserPropertyComponent],
      providers: [
        { provide: ActivatedRoute, useValue: mockRoute },
        { provide: PropertyStore, useValue: mockPropertyStore },
        { provide: Keycloak, useClass: MockKeycloak },
        {
          provide: KEYCLOAK_EVENT_SIGNAL,
          useValue: MOCK_KEYCLOAK_EVENT_SIGNAL,
        },
        { provide: ActivatedRoute, useValue: mockRoute },
        provideTranslateTestingService({
          en: assets_en,
          pl: assets_pl,
          es: assets_es,
          hi: assets_hi,
          zhcn: assets_zhcn,
        }),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(UserPropertyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render page in english (default)', () => {
    testComponentTranslation(UserPropertyComponent, 'en', '#save', 'Save');
  });

  it('should render page in proper language Polish', () => {
    testComponentTranslation(UserPropertyComponent, 'pl', '#save', 'Zapisz');
  });

  it('should render page in proper language Spanish', () => {
    testComponentTranslation(UserPropertyComponent, 'es', '#save', 'Guardar');
  });

  it('should render page in proper language Hindi', () => {
    testComponentTranslation(UserPropertyComponent, 'hi', '#save', 'सहेजें');
  });

  it('should render page in proper language Chinese', () => {
    testComponentTranslation(UserPropertyComponent, 'zhcn', '#save', '保存');
  });
});
