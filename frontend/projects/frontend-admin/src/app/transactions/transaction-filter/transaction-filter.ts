import {Component, inject} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators,} from '@angular/forms';
import {UserAccountComponent} from '../../utils/user-account/user-account.component';
import {UserAccount} from '../../api/model/userAccount';

@Component({
  selector: 'app-transaction-filter',
  templateUrl: './transaction-filter.html',
  imports: [ReactiveFormsModule, UserAccountComponent],
  styleUrl: './transaction-filter.scss',
})
export class TransactionFilter {
  protected readonly formGroup: FormGroup;
  private readonly formBuilder: FormBuilder = inject(FormBuilder);

  constructor() {
    this.formGroup = this.formBuilder.group({
      currency: [null, Validators.required],
      userAccount: [null, Validators.required],
    });
  }

  setUserAccount($event: UserAccount) {
    this.formGroup.patchValue({userAccount: $event, currency: $event.currency});
  }
}
