import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TicketMenu } from './ticket-menu';
import { ActivatedRoute } from '@angular/router';
import { mockRoute } from '../../../mocks/mock-activated-route';
import { testComponentTranslation } from '../../../mocks/test-functions';
import { PropertyStore } from '../../properties/properties.signal-store';
import { mockPropertyStore } from '../../../mocks/mock-store';
import { provideTranslateTestingService } from '../../../mocks/fake-translation-loader';
import assets_en from '../../../assets/i18n/en.json';
import assets_pl from '../../../assets/i18n/pl.json';

describe('TicketMenu', () => {
  let component: TicketMenu;
  let fixture: ComponentFixture<TicketMenu>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TicketMenu],
      providers: [
        { provide: ActivatedRoute, useValue: mockRoute },
        { provide: PropertyStore, useValue: mockPropertyStore },
        provideTranslateTestingService({
          en: assets_en,
          pl: assets_pl,
        }),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(TicketMenu);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should render page in english (default)', () => {
    testComponentTranslation(TicketMenu, 'en', '#addTicket', 'Add Ticket');
  });

  it('should render page in proper language', () => {
    testComponentTranslation(TicketMenu, 'pl', '#addTicket', 'Dodaj Zlecenie');
  });
  // [
  //   {id: 'ticketList', description: 'Ticket List'},
  //   {id: 'addTicket', description: 'Add ticket'},
  //   {id: 'realizedList', description: 'Realized ticket'},
  // ].forEach(({id, description}) => {
  //   it(`should check the menu option ${description} when clicked`, () => {
  //     checkMenuChecked(fixture, `#${id}`);
  //   });
  // });
});
