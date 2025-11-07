import {Component, EventEmitter, inject, Output} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators,} from '@angular/forms';
import {TranslatePipe} from '@ngx-translate/core';
import {MessageFilterParameters} from '../message-filter-parameters';
import {DateRangePickerComponent} from '../../utils/date-range-picker/date-range-picker-component';
import {Select} from 'primeng/select';
import {Button} from 'primeng/button';

@Component({
  selector: 'app-message-filter',
  templateUrl: './message-filter.html',
  styleUrl: './message-filter.css',
  imports: [
    FormsModule,
    ReactiveFormsModule,
    TranslatePipe,
    DateRangePickerComponent,
    Select,
    Button,
  ],
})
export class MessageFilter {
  @Output() messageRequestEvent = new EventEmitter<MessageFilterParameters>();
  protected readonly formGroup: FormGroup;
  protected minDateFrom: Date = new Date();
  protected minDateTo: Date = new Date();
  protected readonly priorities = [1, 2, 3];
  protected readonly Date = Date;
  private readonly formBuilder: FormBuilder = inject(FormBuilder);

  constructor() {
    this.formGroup = this.formBuilder.group({
      priority: new FormControl(null, [Validators.required]),
      dateFrom: new FormControl('', [Validators.required]),
      dateTo: new FormControl('', [Validators.required]),
    });
  }

  loadMessageList() {
    const messageFilterParameters = {
      dateFrom: this.formGroup.get('dateFrom')?.value,
      dateTo: this.formGroup.get('dateTo')?.value,
      priority: this.formGroup.get('priority')?.value,
    } as MessageFilterParameters;

    this.messageRequestEvent.emit(messageFilterParameters);
  }

  onDateRangeChange(dateRange: { dateFrom: Date | null; dateTo: Date | null }) {
    this.formGroup.patchValue({
      dateFrom: dateRange.dateFrom,
      dateTo: dateRange.dateTo,
    });
  }
}
