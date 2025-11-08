import {ComponentFixture, TestBed} from '@angular/core/testing';

import {DateRangePickerComponent} from './date-range-picker-component';
import {ActivatedRoute} from '@angular/router';
import {mockRoute} from '../../../mocks/activated-route-mock';
import {testComponentTranslation, testTranslations} from '../../../mocks/test-functions';

describe('DateRangePickerComponent', () => {
  let component: DateRangePickerComponent;
  let fixture: ComponentFixture<DateRangePickerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DateRangePickerComponent, testTranslations()],
      providers: [{provide: ActivatedRoute, useValue: mockRoute}],
    }).compileComponents();

    fixture = TestBed.createComponent(DateRangePickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should render page in english (default)', () => {
    testComponentTranslation(DateRangePickerComponent, 'en', '#dateFromLabel', 'Date From');
  });

  it('should render page in proper language', () => {
    testComponentTranslation(DateRangePickerComponent, 'pl', '#dateFromLabel', 'Data od');
  });
});
