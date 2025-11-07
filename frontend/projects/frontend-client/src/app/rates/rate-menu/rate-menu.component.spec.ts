import {ComponentFixture, TestBed} from '@angular/core/testing';

import {RateMenuComponent} from './rate-menu.component';
import {ActivatedRoute} from '@angular/router';
import {mockRoute} from '../../../mocks/mock-activated-route';
import {testComponentTranslation, testTranslations,} from '../../../mocks/test-functions';

describe('RateMenuComponent', () => {
  let component: RateMenuComponent;
  let fixture: ComponentFixture<RateMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RateMenuComponent, testTranslations()],
      providers: [{provide: ActivatedRoute, useValue: mockRoute}],
    }).compileComponents();

    fixture = TestBed.createComponent(RateMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should render page in english (default)', () => {
    testComponentTranslation(RateMenuComponent, 'en', '#rateList', 'List rates');
  });

  it('should render page in proper language', () => {
    testComponentTranslation(RateMenuComponent, 'pl', '#rateList', 'List kursów');
  });

  // [{id: 'rateList', description: 'Rate List'}].forEach(
  //   ({id, description}) => {
  //     it(`should check the menu option ${description} when clicked`, () => {
  //       checkMenuChecked(fixture, `#${id}`);
  //     });
  //   },
  // );
});
