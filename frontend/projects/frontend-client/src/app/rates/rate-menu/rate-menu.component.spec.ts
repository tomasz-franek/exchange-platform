import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RateMenuComponent } from './rate-menu.component';
import { ActivatedRoute } from '@angular/router';
import { mockRoute } from '../../../mocks/mock-activated-route';
import { testComponentTranslation } from '../../../mocks/test-functions';
import { PropertyStore } from '../../properties/properties.signal-store';
import { mockPropertyStore } from '../../../mocks/mock-store';
import { provideTranslateTestingService } from '../../../mocks/fake-translation-loader';
import assets_en from '../../../assets/i18n/en.json';
import assets_pl from '../../../assets/i18n/pl.json';

describe('RateMenuComponent', () => {
  let component: RateMenuComponent;
  let fixture: ComponentFixture<RateMenuComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RateMenuComponent],
      providers: [
        { provide: ActivatedRoute, useValue: mockRoute },
        { provide: PropertyStore, useValue: mockPropertyStore },
        provideTranslateTestingService({
          en: assets_en,
          pl: assets_pl,
        }),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(RateMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should render page in english (default)', () => {
    testComponentTranslation(
      RateMenuComponent,
      'en',
      '#rateList',
      'List rates',
    );
  });

  it('should render page in proper language', () => {
    testComponentTranslation(
      RateMenuComponent,
      'pl',
      '#rateList',
      'List kursów',
    );
  });

  // [{id: 'rateList', description: 'Rate List'}].forEach(
  //   ({id, description}) => {
  //     it(`should check the menu option ${description} when clicked`, () => {
  //       checkMenuChecked(fixture, `#${id}`);
  //     });
  //   },
  // );
});
