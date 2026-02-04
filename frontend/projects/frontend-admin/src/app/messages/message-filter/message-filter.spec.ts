import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MessageFilter } from './message-filter';
import { ActivatedRoute } from '@angular/router';
import { mockRoute } from '../../../mocks/activated-route-mock';
import { testComponentTranslation } from '../../../mocks/test-functions';
import { provideTranslateTestingService } from '../../../mocks/fake-translation-loader';
import assets_en from '../../../assets/i18n/en.json';
import assets_pl from '../../../assets/i18n/pl.json';

describe('MessageFilter', () => {
  let component: MessageFilter;
  let fixture: ComponentFixture<MessageFilter>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [MessageFilter],
      providers: [
        { provide: ActivatedRoute, useValue: mockRoute },
        provideTranslateTestingService({
          en: assets_en,
          pl: assets_pl,
        }),
      ],
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
    testComponentTranslation(
      MessageFilter,
      'pl',
      '#priorityLabel',
      'Priorytet',
    );
  });
});
