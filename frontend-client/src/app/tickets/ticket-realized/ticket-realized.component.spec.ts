import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TicketRealizedComponent } from './ticket-realized.component';
import { TranslateService } from '@ngx-translate/core';
import { provideMockStore } from '@ngrx/store/testing';
import { initialTicketState } from '../state/ticket.reducers';
import { ActivatedRoute } from '@angular/router';
import { mockRoute } from '../../../mocks/mock-activated-route';
import { KEYCLOAK_EVENT_SIGNAL } from 'keycloak-angular';
import { MOCK_KEYCLOAK_EVENT_SIGNAL } from '../../../mocks/mock-keycloak-signal';
import Keycloak from 'keycloak-js';
import { MockKeycloak } from '../../../mocks/mock-keycloak';
import { testTranslations } from '../../../mocks/test-functions';

describe('TicketRealizedComponent', () => {
  let component: TicketRealizedComponent;
  let fixture: ComponentFixture<TicketRealizedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TicketRealizedComponent,
        testTranslations()
      ],
      providers: [
        provideMockStore({ initialState: initialTicketState }),
        { provide: ActivatedRoute, useValue: mockRoute },
        {
          provide: KEYCLOAK_EVENT_SIGNAL,
          useValue: MOCK_KEYCLOAK_EVENT_SIGNAL
        },
        { provide: Keycloak, useClass: MockKeycloak }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TicketRealizedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render page in english (default)', () => {
    const translateService = TestBed.inject(TranslateService);
    translateService.setDefaultLang('en');
    const fixture = TestBed.createComponent(TicketRealizedComponent);
    fixture.detectChanges();
    const tdElement: HTMLElement =
      fixture.nativeElement.querySelector('#amount');
    expect(tdElement.innerText).toContain('Amount');
  });

  it('should render page in proper language', () => {
    const fixture = TestBed.createComponent(TicketRealizedComponent);

    const translateService = TestBed.inject(TranslateService);
    translateService.use('pl');

    fixture.detectChanges();
    const tdElement: HTMLElement =
      fixture.nativeElement.querySelector('#amount');
    expect(tdElement.innerText).toContain('Ilość');
  });
});
