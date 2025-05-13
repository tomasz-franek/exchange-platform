import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TicketOrderComponent } from './ticket-order.component';
import { provideMockStore } from '@ngrx/store/testing';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { initialTicketState } from '../state/tickets/ticket.reducer';
import { provideToastr } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';
import { TranslateTestingModule } from 'ngx-translate-testing';

import assets_pl from '../../assets/i18n/pl.json';
import assets_en from '../../assets/i18n/en.json';

describe('TicketOrderComponent', () => {
  let component: TicketOrderComponent;
  let fixture: ComponentFixture<TicketOrderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        TicketOrderComponent,
        TranslateTestingModule.withTranslations(
          'en',
          assets_en,
        ).withTranslations('pl', assets_pl),
      ],
      providers: [
        FormBuilder,
        ReactiveFormsModule,
        provideToastr(),
        provideMockStore({ initialState: initialTicketState }),
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
    const translateService = TestBed.inject(TranslateService);
    translateService.setDefaultLang('en');
    const fixture = TestBed.createComponent(TicketOrderComponent);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('button')?.textContent).toContain(
      'Send order',
    );
  });

  it('should render page in proper language', () => {
    const fixture = TestBed.createComponent(TicketOrderComponent);

    const translateService = TestBed.inject(TranslateService);
    translateService.use('pl');

    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('button')?.textContent).toContain(
      'Wyślij zlecenie',
    );
  });
});
