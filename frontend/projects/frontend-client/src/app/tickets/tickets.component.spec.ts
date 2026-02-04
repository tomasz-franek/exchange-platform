import { TicketsComponent } from './tickets.component';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { mockRoute } from '../../mocks/mock-activated-route';
import { KEYCLOAK_EVENT_SIGNAL } from 'keycloak-angular';
import { MOCK_KEYCLOAK_EVENT_SIGNAL } from '../../mocks/mock-keycloak-signal';
import Keycloak from 'keycloak-js';
import { MockKeycloak } from '../../mocks/mock-keycloak';
import { testComponentTranslation } from '../../mocks/test-functions';
import { PropertyStore } from '../properties/properties.signal-store';
import { mockPropertyStore } from '../../mocks/mock-store';
import { provideTranslateTestingService } from '../../mocks/fake-translation-loader';
import assets_en from '../../assets/i18n/en.json';
import assets_pl from '../../assets/i18n/pl.json';

describe('TicketsComponent', () => {
  let component: TicketsComponent;
  let fixture: ComponentFixture<TicketsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TicketsComponent],
      providers: [
        { provide: ActivatedRoute, useValue: mockRoute },
        { provide: PropertyStore, useValue: mockPropertyStore },
        {
          provide: KEYCLOAK_EVENT_SIGNAL,
          useValue: MOCK_KEYCLOAK_EVENT_SIGNAL,
        },
        { provide: Keycloak, useClass: MockKeycloak },
        provideTranslateTestingService({
          en: assets_en,
          pl: assets_pl,
        }),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(TicketsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should render page in english (default)', () => {
    testComponentTranslation(
      TicketsComponent,
      'en',
      '#ticketList',
      'Ticket list',
    );
  });

  it('should render page in proper language', () => {
    testComponentTranslation(
      TicketsComponent,
      'pl',
      '#ticketList',
      'Lista zleceń',
    );
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
