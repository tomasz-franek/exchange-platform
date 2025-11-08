import {ComponentFixture, TestBed} from '@angular/core/testing';

import {MessageFilter} from './message-filter';
import {ActivatedRoute} from '@angular/router';
import {mockRoute} from '../../../mocks/activated-route-mock';
import {testComponentTranslation, testTranslations} from '../../../mocks/test-functions';

describe('MessageFilter', () => {
  let component: MessageFilter;
  let fixture: ComponentFixture<MessageFilter>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MessageFilter, testTranslations()],
      providers: [{provide: ActivatedRoute, useValue: mockRoute}],
    }).compileComponents();

    fixture = TestBed.createComponent(MessageFilter);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render page in english (default)', () => {
    testComponentTranslation(MessageFilter, 'en', '#priorityLabel', 'Priority');
  });

  it('should render page in proper language', () => {
    testComponentTranslation(MessageFilter, 'pl', '#priorityLabel', 'Priorytet');
  });
});
