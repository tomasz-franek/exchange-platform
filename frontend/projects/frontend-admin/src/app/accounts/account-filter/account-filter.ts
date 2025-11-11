import {Component, EventEmitter, inject, Output} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {AccountFilterParameters} from '../state/account-filter-parameters';
import {DateRangePickerComponent} from '../../utils/date-range-picker/date-range-picker-component';
import {UserAccountComponent} from '../../utils/user-account/user-account.component';
import {UserAccount} from '../../api/model/userAccount';

@Component({
  selector: 'app-account-filter',
  templateUrl: './account-filter.html',
  styleUrl: './account-filter.scss',
  imports: [
    FormsModule,
    ReactiveFormsModule,
    DateRangePickerComponent,
    UserAccountComponent,
  ],
})
export class AccountFilter {
  @Output() accountRequestEvent = new EventEmitter<AccountFilterParameters>();
  maxDateTo: Date = new Date();
  protected readonly formGroup: FormGroup;
  private readonly formBuilder: FormBuilder = inject(FormBuilder);

  constructor() {
    this.formGroup = this.formBuilder.group({
      userAccount: [null, Validators.required],
      dateFromUtc: [null, Validators.required],
      dateToUtc: [null, Validators.required],
    });
  }

  setUserAccount(account: UserAccount) {
    this.formGroup.patchValue({userAccount: account});
    this.loadAccountOperations()
  }

  loadAccountOperations() {
    const userAccount: UserAccount = this.formGroup.get('userAccount')?.value;
    const parameters = {
      userAccountId: userAccount?.id,
      dateFromUtc: this.formGroup.get('dateFromUtc')?.value,
      dateToUtc: this.formGroup.get('dateToUtc')?.value,
      currency: userAccount?.currency,
    } as AccountFilterParameters;
    this.accountRequestEvent.emit(parameters);
  }

  onDateRangeChange(dateRange: { dateFrom: Date | null; dateTo: Date | null }) {
    this.formGroup.patchValue({
      dateFromUtc: dateRange.dateFrom?.toISOString().substring(0, 10),
      dateToUtc: dateRange.dateTo?.toISOString().substring(0, 10),
    });
    this.loadAccountOperations();
  }
}
