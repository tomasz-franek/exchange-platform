import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MessageFilter } from './message-filter';
import { ActivatedRoute } from '@angular/router';
import { mockRoute } from '../../../mocks/activated-route-mock';
import { TranslateService } from '@ngx-translate/core';
import { testTranslations } from '../../../mocks/test-functions';

describe('MessageFilter', () => {
  let component: MessageFilter;
  let fixture: ComponentFixture<MessageFilter>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MessageFilter, testTranslations()],
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
      fixture.nativeElement.querySelector('#priorityLabel');
    expect(idElement.innerText).toContain('Priority');
  });

  it('should render page in proper language', () => {
    const fixture = TestBed.createComponent(MessageFilter);

    const translateService = TestBed.inject(TranslateService);
    translateService.use('pl');

    fixture.detectChanges();
    const idElement: HTMLElement =
      fixture.nativeElement.querySelector('#priorityLabel');
    expect(idElement.innerText).toContain('Priorytet');
  });
});
