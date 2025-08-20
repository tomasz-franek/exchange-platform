import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MessageList } from './message-list';
import { ActivatedRoute } from '@angular/router';
import { mockRoute } from '../../../mocks/activated-route-mock';
import Keycloak from 'keycloak-js';
import { MockKeycloak } from '../../../mocks/mock-keycloak';
import { KEYCLOAK_EVENT_SIGNAL } from 'keycloak-angular';
import { MOCK_KEYCLOAK_EVENT_SIGNAL } from '../../../mocks/mock-keycloak-signal';
import { TranslateService } from '@ngx-translate/core';
import { provideMockStore } from '@ngrx/store/testing';
import { initialAccountState } from '../../accounts/state/account.reducers';
import { testTranslations } from '../../../mocks/test-functions';

describe('MessageList', () => {
  let component: MessageList;
  let fixture: ComponentFixture<MessageList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MessageList, testTranslations()],
      providers: [
        { provide: ActivatedRoute, useValue: mockRoute },
        { provide: Keycloak, useClass: MockKeycloak },
        {
          provide: KEYCLOAK_EVENT_SIGNAL,
          useValue: MOCK_KEYCLOAK_EVENT_SIGNAL,
        },
        provideMockStore({ initialState: initialAccountState }),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(MessageList);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render page in english (default)', () => {
    const translateService = TestBed.inject(TranslateService);
    translateService.setDefaultLang('en');
    const fixture = TestBed.createComponent(MessageList);

    fixture.detectChanges();
    const idElement: HTMLElement = fixture.nativeElement.querySelector('#date');
    expect(idElement.innerText).toContain('Date');
  });

  it('should render page in proper language', () => {
    const fixture = TestBed.createComponent(MessageList);

    const translateService = TestBed.inject(TranslateService);
    translateService.use('pl');

    fixture.detectChanges();
    const idElement: HTMLElement = fixture.nativeElement.querySelector('#date');
    expect(idElement.innerText).toContain('Data');
  });
});
