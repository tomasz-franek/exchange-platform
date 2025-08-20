import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TicketOrderComponent } from './ticket-order.component';
import { provideMockStore } from '@ngrx/store/testing';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { initialTicketState } from '../state/ticket.reducers';
import { provideToastr } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';
import { Direction } from '../../api/model/direction';
import { Pair } from '../../api/model/pair';
import Keycloak from 'keycloak-js';
import { MockKeycloak } from '../../../mocks/mock-keycloak';
import { KEYCLOAK_EVENT_SIGNAL } from 'keycloak-angular';
import { MOCK_KEYCLOAK_EVENT_SIGNAL } from '../../../mocks/mock-keycloak-signal';
import { ActivatedRoute } from '@angular/router';
import { mockRoute } from '../../../mocks/mock-activated-route';
import { initialAccountState } from '../../accounts/state/account.reducers';
import { WebsocketService } from '../../../services/websocket/websocket.service';
import { mockWebsocketService } from '../../../mocks/mock-web-socket-service';
import { testTranslations } from '../../../mocks/test-functions';

describe('TicketOrderComponent', () => {
  let component: TicketOrderComponent;
  let fixture: ComponentFixture<TicketOrderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        TicketOrderComponent,
        testTranslations()
      ],
      providers: [
        FormBuilder,
        ReactiveFormsModule,
        provideToastr(),
        provideMockStore({ initialState: initialTicketState }),
        { provide: Keycloak, useClass: MockKeycloak },
        {
          provide: KEYCLOAK_EVENT_SIGNAL,
          useValue: MOCK_KEYCLOAK_EVENT_SIGNAL
        },
        { provide: ActivatedRoute, useValue: mockRoute },
        { provide: WebsocketService, useValue: mockWebsocketService },
        provideMockStore({ initialState: initialAccountState })
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(TicketOrderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render page in english (default)', () => {
    const translateService = TestBed.inject(TranslateService);
    translateService.setDefaultLang('en');
    const fixture = TestBed.createComponent(TicketOrderComponent);
    fixture.detectChanges();
    const idElement: HTMLElement = fixture.nativeElement.querySelector('#labelPair');
    expect(idElement.innerText).toContain('Exchange Pair');
  });

  it('should render page in proper language', () => {
    const fixture = TestBed.createComponent(TicketOrderComponent);

    const translateService = TestBed.inject(TranslateService);
    translateService.use('pl');

    fixture.detectChanges();
    const idElement: HTMLElement = fixture.nativeElement.querySelector('#labelPair');
    expect(idElement.innerText).toContain('Para walutowa');
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
