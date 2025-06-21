import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AsyncPipe, NgForOf } from '@angular/common';
import { TranslatePipe } from '@ngx-translate/core';
import { Store } from '@ngrx/store';
import {
  AccountState,
  selectAccountBalanceList,
} from '../state/account/account.selectors';
import {
  loadAccountBalanceListAction,
  saveDeposit,
  saveWithdraw,
} from '../state/account/account.actions';
import { EventType } from '../api/model/eventType';
import { UserAccountOperation } from '../api/model/userAccountOperation';
import { Observable, Subject, takeUntil } from 'rxjs';
import { AccountBalance } from '../api/model/accountBalance';

@Component({
  selector: 'app-deposit',
  imports: [
    FormsModule,
    NgForOf,
    ReactiveFormsModule,
    TranslatePipe,
    AsyncPipe,
  ],
  templateUrl: './deposit.component.html',
  styleUrl: './deposit.component.css',
})
export class DepositComponent implements OnInit, OnDestroy {
  formGroup: FormGroup;
  protected _account$!: Observable<AccountBalance[]>;
  protected operations: string[] = [EventType.Deposit, EventType.Withdraw];
  private _storeAccount$: Store<AccountState> = inject(Store);
  private readonly _destroy$: Subject<void> = new Subject<void>();

  constructor(private formBuilder: FormBuilder) {
    this.formGroup = this.formBuilder.group({
      amount: new FormControl(0, [Validators.required, Validators.min(0.01)]),
      operation: new FormControl('', [Validators.required]),
      userAccountId: new FormControl('', [Validators.required]),
    });
  }

  ngOnInit() {
    this._account$ = this._storeAccount$
      .select(selectAccountBalanceList)
      .pipe(takeUntil(this._destroy$));
    this._storeAccount$.dispatch(loadAccountBalanceListAction());
  }

  ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
  }

  sendRequest() {
    let request: UserAccountOperation = {
      amount: this.formGroup.get('amount')?.value,
      userAccountId: this.formGroup.get('userAccountId')?.value,
    };
    request.amount = request.amount * 1_0000;
    if (this.formGroup.get('operation')?.value == EventType.Deposit) {
      this._storeAccount$.dispatch(saveDeposit({ depositRequest: request }));
    }
    if (this.formGroup.get('operation')?.value == EventType.Withdraw) {
      this._storeAccount$.dispatch(saveWithdraw({ withdrawRequest: request }));
    }
  }
}
