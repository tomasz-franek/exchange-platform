import {ComponentFixture, TestBed} from '@angular/core/testing';

import {MessageMenu} from './message-menu';
import {ActivatedRoute} from '@angular/router';
import {mockRoute} from '../../../mocks/activated-route-mock';
import {checkMenuChecked, testComponentTranslation, testTranslations,} from '../../../mocks/test-functions';

describe('MessageMenu', () => {
  let component: MessageMenu;
  let fixture: ComponentFixture<MessageMenu>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MessageMenu, testTranslations()],
      providers: [{provide: ActivatedRoute, useValue: mockRoute}],
    }).compileComponents();

    fixture = TestBed.createComponent(MessageMenu);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render page in english (default)', () => {
    testComponentTranslation(fixture, 'en', '#labelMessageList', 'Message List');
  });

  it('should render page in proper language', () => {
    testComponentTranslation(fixture, 'pl', '#labelMessageList', 'Lista wiadomości');
  });

  [
    {id: 'messageList', description: 'Message List'},
    {id: 'messageAdd', description: 'Message Add'}
  ].forEach(
    ({id, description}) => {
      it(`should check the menu option ${description} when clicked`, () => {
        checkMenuChecked(fixture, `#${id}`);
      });
    },
  );
});
