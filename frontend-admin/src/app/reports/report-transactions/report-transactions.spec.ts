import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportTransactions } from './report-transactions';
import { TranslateService } from '@ngx-translate/core';
import { TranslateTestingModule } from 'ngx-translate-testing';
import assets_en from '../../../assets/i18n/en.json';
import assets_pl from '../../../assets/i18n/pl.json';
import Keycloak from 'keycloak-js';
import { MockKeycloak } from '../../../mocks/mock-keycloak';
import { KEYCLOAK_EVENT_SIGNAL } from 'keycloak-angular';
import { MOCK_KEYCLOAK_EVENT_SIGNAL } from '../../../mocks/mock-keycloak-signal';
import { provideMockStore } from '@ngrx/store/testing';
import { initialAccountState } from '../../accounts/state/account.reducers';
import { ActivatedRoute } from '@angular/router';
import { mockRoute } from '../../../mocks/activated-route-mock';
import { MenuComponent } from '../../menu/menu.component';

describe('ReportTransactions', () => {
  let component: ReportTransactions;
  let fixture: ComponentFixture<ReportTransactions>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        ReportTransactions,
        MenuComponent,
        TranslateTestingModule.withTranslations(
          'en',
          assets_en,
        ).withTranslations('pl', assets_pl),
      ],
      providers: [
        { provide: Keycloak, useClass: MockKeycloak },
        {
          provide: KEYCLOAK_EVENT_SIGNAL,
          useValue: MOCK_KEYCLOAK_EVENT_SIGNAL,
        },
        provideMockStore({ initialState: initialAccountState }),
        { provide: ActivatedRoute, useValue: mockRoute },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ReportTransactions);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render page in english (default)', () => {
    const translateService = TestBed.inject(TranslateService);
    translateService.setDefaultLang('en');
    const fixture = TestBed.createComponent(ReportTransactions);

    fixture.detectChanges();
    const idElement: HTMLElement =
      fixture.nativeElement.querySelector('#transactionReport');
    expect(idElement.innerText).toContain('Generate report');
  });

  it('should render page in proper language', () => {
    const fixture = TestBed.createComponent(ReportTransactions);

    const translateService = TestBed.inject(TranslateService);
    translateService.use('pl');

    fixture.detectChanges();
    const idElement: HTMLElement =
      fixture.nativeElement.querySelector('#transactionReport');
    expect(idElement.innerText).toContain('Generuj raport');
  });
});
