import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DateRangePickerComponent } from './date-range-picker-component';
import { ActivatedRoute } from '@angular/router';
import { mockRoute } from '../../../mocks/activated-route-mock';
import { testComponentTranslation } from '../../../mocks/test-functions';
import { provideTranslateTestingService } from '../../../mocks/fake-translation-loader';
import assets_en from '../../../assets/i18n/en.json';
import assets_pl from '../../../assets/i18n/pl.json';

describe('DateRangePickerComponent', () => {
  let component: DateRangePickerComponent;
  let fixture: ComponentFixture<DateRangePickerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DateRangePickerComponent],
      providers: [
        { provide: ActivatedRoute, useValue: mockRoute },
        provideTranslateTestingService({
          en: assets_en,
          pl: assets_pl,
        }),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(DateRangePickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should render page in english (default)', () => {
    testComponentTranslation(
      DateRangePickerComponent,
      'en',
      '#dateFromLabel',
      'Date From',
    );
  });

  it('should render page in proper language', () => {
    testComponentTranslation(
      DateRangePickerComponent,
      'pl',
      '#dateFromLabel',
      'Data od',
    );
  });

  describe('updateDateToMinDate', () => {
    it('should set minDateTo to the next day of the given date', () => {
      const inputDate = new Date('2026-01-13'); // input date
      component.updateDateToMinDate(inputDate);

      const expectedMinDateTo = new Date(inputDate);
      expectedMinDateTo.setDate(expectedMinDateTo.getDate() + 1); // next day

      expect(component.formGroup.get('minDateTo')?.value).toEqual(
        expectedMinDateTo,
      );
    });

    it('should clear dateTo field when updateDateToMinDate is called', () => {
      component.formGroup.patchValue({ dateTo: new Date() }); // set an initial dateTo
      const inputDate = new Date('2026-01-13');
      component.updateDateToMinDate(inputDate);

      expect(component.formGroup.get('dateTo')?.value).toBe('');
    });
  });
});
