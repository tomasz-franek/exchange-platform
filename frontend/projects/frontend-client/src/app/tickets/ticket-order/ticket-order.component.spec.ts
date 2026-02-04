import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TicketOrderComponent } from './ticket-order.component';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { Direction } from '../../api/model/direction';
import { Pair } from '../../api/model/pair';
import Keycloak from 'keycloak-js';
import { MockKeycloak } from '../../../mocks/mock-keycloak';
import { KEYCLOAK_EVENT_SIGNAL } from 'keycloak-angular';
import { MOCK_KEYCLOAK_EVENT_SIGNAL } from '../../../mocks/mock-keycloak-signal';
import { ActivatedRoute } from '@angular/router';
import { mockRoute } from '../../../mocks/mock-activated-route';
import { WebsocketService } from '../../../services/websocket/websocket.service';
import { mockWebsocketService } from '../../../mocks/mock-web-socket-service';
import { testComponentTranslation } from '../../../mocks/test-functions';
import { TicketStore } from '../tickets.signal-store';
import {
  mockAccountsStore,
  mockPropertyStore,
  mockTicketsStore,
} from '../../../mocks/mock-store';
import { PropertyStore } from '../../properties/properties.signal-store';
import { AccountsStore } from '../../accounts/accounts.signal-store';
import { MessageService } from 'primeng/api';
import { provideTranslateTestingService } from '../../../mocks/fake-translation-loader';
import assets_en from '../../../assets/i18n/en.json';
import assets_pl from '../../../assets/i18n/pl.json';

describe('TicketOrderComponent', () => {
  let component: TicketOrderComponent;
  let fixture: ComponentFixture<TicketOrderComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TicketOrderComponent],
      providers: [
        FormBuilder,
        MessageService,
        ReactiveFormsModule,
        { provide: TicketStore, useValue: mockTicketsStore },
        { provide: PropertyStore, useValue: mockPropertyStore },
        { provide: AccountsStore, useValue: mockAccountsStore },
        { provide: Keycloak, useClass: MockKeycloak },
        {
          provide: KEYCLOAK_EVENT_SIGNAL,
          useValue: MOCK_KEYCLOAK_EVENT_SIGNAL,
        },
        { provide: ActivatedRoute, useValue: mockRoute },
        { provide: WebsocketService, useValue: mockWebsocketService },
        provideTranslateTestingService({
          en: assets_en,
          pl: assets_pl,
        }),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(TicketOrderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render page in english (default)', () => {
    testComponentTranslation(
      TicketOrderComponent,
      'en',
      '#labelPair',
      'Exchange Pair',
    );
  });

  it('should render page in proper language', () => {
    testComponentTranslation(
      TicketOrderComponent,
      'pl',
      '#labelPair',
      'Para walutowa',
    );
  });

  it('should have a form group with required fields', () => {
    expect(component.formGroup.get('ratio')).toBeTruthy();
    expect(component.formGroup.get('amount')).toBeTruthy();
    expect(component.formGroup.get('pair')).toBeTruthy();
    expect(component.formGroup.get('direction')).toBeTruthy();
  });

  it('should validate ratio field', () => {
    const ratioControl = component.formGroup.get('ratio');
    ratioControl?.setValue(0);
    expect(ratioControl?.valid).toBeFalse();
    ratioControl?.setValue(0.0001);
    expect(ratioControl?.valid).toBeTrue();
  });

  it('should validate amount field', () => {
    const valueControl = component.formGroup.get('amount');
    valueControl?.setValue(0);
    expect(valueControl?.valid).toBeFalse();
    valueControl?.setValue(0.01);
    expect(valueControl?.valid).toBeTrue();
  });

  it('should validate pair field', () => {
    const pairControl = component.formGroup.get('pair');
    pairControl?.setValue(null);
    expect(pairControl?.valid).toBeFalse();
    pairControl?.setValue(Pair.GbpUsd);
    expect(pairControl?.valid).toBeTrue();
  });

  it('should validate direction field', () => {
    const directionControl = component.formGroup.get('direction');
    directionControl?.setValue(null);
    expect(directionControl?.valid).toBeFalse();
    directionControl?.setValue(Direction.Sell);
    expect(directionControl?.valid).toBeTrue();
  });

  it('should validate form group', () => {
    component.formGroup.get('ratio')?.setValue(0.0001);
    component.formGroup.get('amount')?.setValue(0.01);
    component.formGroup.get('pair')?.setValue(Pair.GbpPln);
    component.formGroup.get('direction')?.setValue(Direction.Buy);
    component.formGroup.get('userAccountId')?.setValue('x');
    expect(component.formGroup.valid).toBeTrue();
  });
});
