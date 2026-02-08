import {
  Component,
  EventEmitter,
  inject,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { TranslatePipe } from '@ngx-translate/core';
import { DatePicker } from 'primeng/datepicker';

@Component({
  selector: 'app-date-range-picker',
  templateUrl: './date-range-picker-component.html',
  styleUrl: './date-range-picker-component.scss',
  imports: [FormsModule, ReactiveFormsModule, TranslatePipe, DatePicker],
})
export class DateRangePickerComponent implements OnChanges {
  @Input() isDateFromMandatory = false;
  @Input() isMinDateFromMandatory = false;
  @Input() isMaxDateFromMandatory = false;
  @Input() minDateFrom: Date | undefined = undefined;
  @Input() maxDateFrom: Date | undefined = undefined;
  @Input() minDateTo: Date | undefined = undefined;
  @Input() maxDateTo: Date | undefined = undefined;
  @Input() isDateToMandatory = false;
  @Input() isMinDateToMandatory = false;
  @Input() isMaxDateToMandatory = false;

  @Output() dateRangeChange = new EventEmitter<{
    dateFrom: Date | null;
    dateTo: Date | null;
  }>();

  formGroup: FormGroup;
  private readonly formBuilder: FormBuilder = inject(FormBuilder);

  constructor() {
    this.formGroup = this.formBuilder.group({
      dateFrom: [null, this.isDateFromMandatory ? Validators.required : null],
      minDateFrom: [
        this.minDateFrom,
        this.isMinDateFromMandatory ? Validators.required : null,
      ],
      dateTo: [null, this.isDateToMandatory ? Validators.required : null],
      minDateTo: [
        this.minDateTo,
        this.isMinDateToMandatory ? Validators.required : null,
      ],
      maxDateFrom: [
        this.maxDateFrom,
        this.isMaxDateFromMandatory ? Validators.required : null,
      ],
      maxDateTo: [
        this.maxDateTo,
        this.isMaxDateToMandatory ? Validators.required : null,
      ],
    });

    this.formGroup.valueChanges.subscribe((value) => {
      this.dateRangeChange.emit({
        dateFrom: value.dateFrom ? new Date(value.dateFrom) : null,
        dateTo: value.dateTo ? new Date(value.dateTo) : null,
      });
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    this.formGroup.patchValue({
      minDateFrom:
        changes['minDateFrom'] == null
          ? this.formGroup.get('dateFrom')?.value
          : changes['minDateFrom'].currentValue,
      minDateTo:
        changes['minDateTo'] == null
          ? this.formGroup.get('dateTo')?.value
          : changes['minDateTo'].currentValue,
      maxDateFrom:
        changes['maxDateFrom'] == null
          ? this.formGroup.get('dateFrom')?.value
          : changes['maxDateFrom'].currentValue,
      maxDateTo:
        changes['maxDateTo'] == null
          ? this.formGroup.get('dateTo')?.value
          : changes['maxDateTo'].currentValue,
    });
  }

  updateDateToMinDate(value: Date) {
    const nextDay: Date = new Date(value);
    nextDay.setDate(nextDay.getDate() + 1);
    this.formGroup.patchValue({ minDateTo: nextDay });
    this.formGroup.patchValue({ dateTo: '' });
  }
}
