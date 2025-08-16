import { Component, EventEmitter, inject, Output } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { TranslatePipe } from '@ngx-translate/core';
import { BsDatepickerDirective, BsDatepickerInputDirective } from 'ngx-bootstrap/datepicker';
import { MessageFilterParameters } from '../message-filter-parameters';

@Component({
  selector: 'app-message-filter',
  templateUrl: './message-filter.html',
  styleUrl: './message-filter.css',
  imports: [
    FormsModule,
    ReactiveFormsModule,
    TranslatePipe,
    BsDatepickerDirective,
    BsDatepickerInputDirective,
  ],
})
export class MessageFilter {
  @Output() messageRequestEvent = new EventEmitter<MessageFilterParameters>();
  protected readonly formGroup: FormGroup;
  protected minDateFrom: Date = new Date();
  protected minDateTo: Date = new Date();
  protected readonly priorities = [1, 2, 3];
  private readonly formBuilder: FormBuilder = inject(FormBuilder);

  constructor() {
    this.formGroup = this.formBuilder.group({
      priority: new FormControl(null, [Validators.required]),
      dateFrom: new FormControl('', [Validators.required]),
      dateTo: new FormControl('', [Validators.required]),
    });
  }

  updateDateToMinDate(value: Date) {
    const nextDay: Date = new Date(value);
    nextDay.setDate(nextDay.getDate() + 1);
    this.minDateTo = nextDay;
    this.formGroup.patchValue({ dateTo: '' });
  }

  loadMessageList() {
    const messageFilterParameters = {
      dateFrom: this.formGroup.get('dateFrom')?.value,
      dateTo: this.formGroup.get('dateTo')?.value,
      priority: this.formGroup.get('priority')?.value,
    } as MessageFilterParameters;

    this.messageRequestEvent.emit(messageFilterParameters);
  }
}
