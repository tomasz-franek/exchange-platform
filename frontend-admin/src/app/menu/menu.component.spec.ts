import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MenuComponent } from './menu.component';
import Keycloak from 'keycloak-js';
import { MockKeycloak } from '../../mocks/mock-keycloak';
import { KEYCLOAK_EVENT_SIGNAL } from 'keycloak-angular';
import { ActivatedRoute } from '@angular/router';
import { mockRoute } from '../../mocks/activated-route-mock';
import { MOCK_KEYCLOAK_EVENT_SIGNAL } from '../../mocks/mock-keycloak-signal';
import { TranslateService } from '@ngx-translate/core';
import { initialPropertyState } from '../properties/state/properties.reducers';
import { provideMockStore } from '@ngrx/store/testing';
import { checkMenuChecked, testTranslations } from '../../mocks/test-functions';

describe('MenuComponent', () => {
  let component: MenuComponent;
  let fixture: ComponentFixture<MenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MenuComponent, testTranslations()],
      providers: [
        { provide: Keycloak, useClass: MockKeycloak },
        {
          provide: KEYCLOAK_EVENT_SIGNAL,
          useValue: MOCK_KEYCLOAK_EVENT_SIGNAL,
        },
        { provide: ActivatedRoute, useValue: mockRoute },
        provideMockStore({ initialState: initialPropertyState }),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(MenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render page in english (default)', () => {
    const translateService = TestBed.inject(TranslateService);
    translateService.setDefaultLang('en');
    const fixture = TestBed.createComponent(MenuComponent);

    fixture.detectChanges();
    const idElement: HTMLElement =
      fixture.nativeElement.querySelector('#accountsLabel');
    expect(idElement.innerText).toContain('Accounts');
  });

  it('should render page in proper language', () => {
    const fixture = TestBed.createComponent(MenuComponent);

    const translateService = TestBed.inject(TranslateService);
    translateService.use('pl');

    fixture.detectChanges();
    const idElement: HTMLElement =
      fixture.nativeElement.querySelector('#accountsLabel');
    expect(idElement.innerText).toContain('Konta');
  });

  [
    { id: 'accounts', description: 'Accounts' },
    { id: 'transactions', description: 'Transactions' },
    { id: 'reports', description: 'Reports' },
    { id: 'messages', description: 'Messages' },
    { id: 'statistics', description: 'Statistics' },
    { id: 'monitoring', description: 'Monitoring' },
    { id: 'properties', description: 'Properties' },
  ].forEach(({ id, description }) => {
    it(`should check the menu option ${description} when clicked`, () => {
      checkMenuChecked(fixture, `#${id}`);
    });
  });
});
