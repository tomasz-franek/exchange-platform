import { TicketsComponent } from './tickets.component';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { mockRoute } from '../../mocks/mock-activated-route';
import { TranslateTestingModule } from 'ngx-translate-testing';
import assets_en from '../../assets/i18n/en.json';
import assets_pl from '../../assets/i18n/pl.json';
import { TranslateService } from '@ngx-translate/core';
import { KEYCLOAK_EVENT_SIGNAL } from 'keycloak-angular';
import { MOCK_KEYCLOAK_EVENT_SIGNAL } from '../../mocks/mock-keycloak-signal';
import Keycloak from 'keycloak-js';
import { MockKeycloak } from '../../mocks/mock-keycloak';

describe('TicketsComponent', () => {
  let component: TicketsComponent;
  let fixture: ComponentFixture<TicketsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        TicketsComponent,
        TranslateTestingModule.withTranslations(
          'en',
          assets_en
        ).withTranslations('pl', assets_pl)
      ],
      providers: [
        { provide: ActivatedRoute, useValue: mockRoute },
        {
          provide: KEYCLOAK_EVENT_SIGNAL,
          useValue: MOCK_KEYCLOAK_EVENT_SIGNAL
        },
        { provide: Keycloak, useClass: MockKeycloak }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(TicketsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should render page in english (default)', () => {
    const translateService = TestBed.inject(TranslateService);
    translateService.setDefaultLang('en');
    const fixture = TestBed.createComponent(TicketsComponent);

    fixture.detectChanges();
    const idElement: HTMLElement =
      fixture.nativeElement.querySelector('#labelTicketList');
    expect(idElement.innerText).toContain('Ticket list');
  });

  it('should render page in proper language', () => {
    const fixture = TestBed.createComponent(TicketsComponent);

    const translateService = TestBed.inject(TranslateService);
    translateService.use('pl');

    fixture.detectChanges();
    const idElement: HTMLElement =
      fixture.nativeElement.querySelector('#labelTicketList');
    expect(idElement.innerText).toContain('Lista zleceń');
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
