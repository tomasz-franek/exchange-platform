import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MessageComponent } from './message.component';
import { TranslateService } from '@ngx-translate/core';
import { TranslateTestingModule } from 'ngx-translate-testing';
import assets_en from '../../assets/i18n/en.json';
import assets_pl from '../../assets/i18n/pl.json';
import { ActivatedRoute } from '@angular/router';
import { mockRoute } from '../../mocks/mock-activated-route';

describe('MessageComponent', () => {
  let component: MessageComponent;
  let fixture: ComponentFixture<MessageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MessageComponent,
        TranslateTestingModule.withTranslations(
          'en',
          assets_en
        ).withTranslations('pl', assets_pl)
      ],
      providers: [{ provide: ActivatedRoute, useValue: mockRoute }]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MessageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render page in english (default)', () => {
    const translateService = TestBed.inject(TranslateService);
    translateService.setDefaultLang('en');
    const fixture = TestBed.createComponent(MessageComponent);

    fixture.detectChanges();
    const idElement: HTMLElement =
      fixture.nativeElement.querySelector('#labelReportTransactions');
    expect(idElement.innerText).toContain('Transaction List');
  });

  it('should render page in proper language', () => {
    const fixture = TestBed.createComponent(MessageComponent);

    const translateService = TestBed.inject(TranslateService);
    translateService.use('pl');

    fixture.detectChanges();
    const idElement: HTMLElement =
      fixture.nativeElement.querySelector('#labelReportTransactions');
    expect(idElement.innerText).toContain('Lista transakcji');
  });
});
