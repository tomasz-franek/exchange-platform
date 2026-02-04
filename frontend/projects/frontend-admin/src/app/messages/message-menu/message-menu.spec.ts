import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MessageMenu } from './message-menu';
import { ActivatedRoute } from '@angular/router';
import { mockRoute } from '../../../mocks/activated-route-mock';
import { testComponentTranslation } from '../../../mocks/test-functions';
import { PropertyStore } from '../../properties/properties.signal-store';
import { mockPropertyStore } from '../../../mocks/mock-store';
import { provideTranslateTestingService } from '../../../mocks/fake-translation-loader';
import assets_en from '../../../assets/i18n/en.json';
import assets_pl from '../../../assets/i18n/pl.json';

describe('MessageMenu', () => {
  let component: MessageMenu;
  let fixture: ComponentFixture<MessageMenu>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [MessageMenu],
      providers: [
        { provide: ActivatedRoute, useValue: mockRoute },
        { provide: PropertyStore, useValue: mockPropertyStore },
        provideTranslateTestingService({
          en: assets_en,
          pl: assets_pl,
        }),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(MessageMenu);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render page in english (default)', () => {
    testComponentTranslation(MessageMenu, 'en', '#messageList', 'Message List');
  });

  it('should render page in proper language', () => {
    testComponentTranslation(
      MessageMenu,
      'pl',
      '#messageList',
      'Lista wiadomości',
    );
  });

  // [
  //   {id: 'messageList', description: 'Message List'},
  //   {id: 'messageAdd', description: 'Message Add'}
  // ].forEach(
  //   ({id, description}) => {
  //     it(`should check the menu option ${description} when clicked`, () => {
  //       checkMenuChecked(fixture, `#${id}`);
  //     });
  //   },
  // );
});
