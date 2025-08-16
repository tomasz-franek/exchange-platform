import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MessageFilter } from './message-filter';
import { TranslateTestingModule } from 'ngx-translate-testing';
import assets_en from '../../../assets/i18n/en.json';
import assets_pl from '../../../assets/i18n/pl.json';
import { ActivatedRoute } from '@angular/router';
import { mockRoute } from '../../../mocks/activated-route-mock';
import { TranslateService } from '@ngx-translate/core';

describe('MessageFilter', () => {
  let component: MessageFilter;
  let fixture: ComponentFixture<MessageFilter>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        MessageFilter,
        TranslateTestingModule.withTranslations(
          'en',
          assets_en,
        ).withTranslations('pl', assets_pl),
      ],
      providers: [{ provide: ActivatedRoute, useValue: mockRoute }],
    }).compileComponents();

    fixture = TestBed.createComponent(MessageFilter);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render page in english (default)', () => {
    const translateService = TestBed.inject(TranslateService);
    translateService.setDefaultLang('en');
    const fixture = TestBed.createComponent(MessageFilter);

    fixture.detectChanges();
    const idElement: HTMLElement =
      fixture.nativeElement.querySelector('#dateFromLabel');
    expect(idElement.innerText).toContain('Date From');
  });

  it('should render page in proper language', () => {
    const fixture = TestBed.createComponent(MessageFilter);

    const translateService = TestBed.inject(TranslateService);
    translateService.use('pl');

    fixture.detectChanges();
    const idElement: HTMLElement =
      fixture.nativeElement.querySelector('#dateFromLabel');
    expect(idElement.innerText).toContain('Data od');
  });
});
