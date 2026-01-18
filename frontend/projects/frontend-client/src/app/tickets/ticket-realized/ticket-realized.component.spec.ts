import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TicketRealizedComponent } from './ticket-realized.component';
import { ActivatedRoute } from '@angular/router';
import { mockRoute } from '../../../mocks/mock-activated-route';
import { KEYCLOAK_EVENT_SIGNAL } from 'keycloak-angular';
import { MOCK_KEYCLOAK_EVENT_SIGNAL } from '../../../mocks/mock-keycloak-signal';
import Keycloak from 'keycloak-js';
import { MockKeycloak } from '../../../mocks/mock-keycloak';
import {
  testComponentTranslation,
  testTranslations,
} from '../../../mocks/test-functions';
import { TicketStore } from '../tickets.signal-store';
import { mockPropertyStore, mockTicketsStore } from '../../../mocks/mock-store';
import { PropertyStore } from '../../properties/properties.signal-store';

describe('TicketRealizedComponent', () => {
  let component: TicketRealizedComponent;
  let fixture: ComponentFixture<TicketRealizedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TicketRealizedComponent, testTranslations()],
      providers: [
        { provide: TicketStore, useValue: mockTicketsStore },
        { provide: PropertyStore, useValue: mockPropertyStore },
        { provide: ActivatedRoute, useValue: mockRoute },
        {
          provide: KEYCLOAK_EVENT_SIGNAL,
          useValue: MOCK_KEYCLOAK_EVENT_SIGNAL,
        },
        { provide: Keycloak, useClass: MockKeycloak },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(TicketRealizedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render page in english (default)', () => {
    testComponentTranslation(
      TicketRealizedComponent,
      'en',
      '#amount',
      'Amount',
    );
  });

  it('should render page in proper language', () => {
    testComponentTranslation(TicketRealizedComponent, 'pl', '#amount', 'Ilość');
  });
});
