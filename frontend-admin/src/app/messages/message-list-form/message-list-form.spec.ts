import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MessageListForm } from './message-list-form';
import { MenuComponent } from '../../menu/menu.component';
import { TranslateTestingModule } from 'ngx-translate-testing';
import assets_en from '../../../assets/i18n/en.json';
import assets_pl from '../../../assets/i18n/pl.json';
import Keycloak from 'keycloak-js';
import { MockKeycloak } from '../../../mocks/mock-keycloak';
import { KEYCLOAK_EVENT_SIGNAL } from 'keycloak-angular';
import { MOCK_KEYCLOAK_EVENT_SIGNAL } from '../../../mocks/mock-keycloak-signal';
import { provideMockStore } from '@ngrx/store/testing';
import { ActivatedRoute } from '@angular/router';
import { mockRoute } from '../../../mocks/activated-route-mock';
import { MessageList } from '../message-list/message-list';
import { TranslateService } from '@ngx-translate/core';
import { initialMessageState } from '../state/message.reducers';

describe('MessageListForm', () => {
  let component: MessageListForm;
  let fixture: ComponentFixture<MessageListForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        MessageListForm,
        MessageList,
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
        provideMockStore({ initialState: initialMessageState }),
        { provide: ActivatedRoute, useValue: mockRoute },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(MessageListForm);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render page in english (default)', () => {
    const translateService = TestBed.inject(TranslateService);
    translateService.setDefaultLang('en');
    const fixture = TestBed.createComponent(MessageListForm);

    fixture.detectChanges();
    const idElement: HTMLElement =
      fixture.nativeElement.querySelector('#dateToLabel');
    expect(idElement.innerText).toContain('Date To');
  });

  it('should render page in proper language', () => {
    const fixture = TestBed.createComponent(MessageListForm);

    const translateService = TestBed.inject(TranslateService);
    translateService.use('pl');

    fixture.detectChanges();
    const idElement: HTMLElement =
      fixture.nativeElement.querySelector('#dateToLabel');
    expect(idElement.innerText).toContain('Data do');
  });
});
