import {ComponentFixture, TestBed} from '@angular/core/testing';
import {PropertiesComponent} from './properties.component';
import {ActivatedRoute} from '@angular/router';
import {mockRoute} from '../../mocks/mock-activated-route';
import Keycloak from 'keycloak-js';
import {MockKeycloak} from '../../mocks/mock-keycloak';
import {KEYCLOAK_EVENT_SIGNAL} from 'keycloak-angular';
import {MOCK_KEYCLOAK_EVENT_SIGNAL} from '../../mocks/mock-keycloak-signal';
import {testComponentTranslation, testTranslations,} from '../../mocks/test-functions';

describe('PropertiesComponent', () => {
  let component: PropertiesComponent;
  let fixture: ComponentFixture<PropertiesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PropertiesComponent, testTranslations()],
      providers: [
        {provide: ActivatedRoute, useValue: mockRoute},
        {
          provide: KEYCLOAK_EVENT_SIGNAL,
          useValue: MOCK_KEYCLOAK_EVENT_SIGNAL,
        },
        {provide: Keycloak, useClass: MockKeycloak},
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(PropertiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render page in english (default)', () => {
    testComponentTranslation(
      PropertiesComponent,
      'en',
      '#userProperty',
      'User property',
    );
  });

  it('should render page in proper language', () => {
    testComponentTranslation(
      PropertiesComponent,
      'pl',
      '#userProperty',
      'Ustawienia użytkownika',
    );
  });
});
