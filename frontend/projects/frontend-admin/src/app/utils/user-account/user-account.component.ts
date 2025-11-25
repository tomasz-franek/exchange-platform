import {Component, EventEmitter, inject, OnInit, Output} from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {TranslatePipe} from '@ngx-translate/core';
import {UserData} from '../../api/model/userData';
import {LoadUserRequest} from '../../api/model/loadUserRequest';
import {UserAccount} from '../../api/model/userAccount';
import {Select} from 'primeng/select';
import {CommonModule} from '@angular/common';
import {Card} from 'primeng/card';
import {AccountsStore} from '../../accounts/accounts.signal-store';

@Component({
  selector: 'app-user-account',
  standalone: true,
  templateUrl: './user-account.component.html',
  imports: [ReactiveFormsModule, TranslatePipe, Select, CommonModule, Card],
  styleUrl: './user-account.component.scss',
})
export class UserAccountComponent implements OnInit {
  @Output() userAccountEvent = new EventEmitter<UserAccount>();
  @Output() userEvent = new EventEmitter<UserData>();
  protected readonly formGroup: FormGroup;
  protected readonly store = inject(AccountsStore);
  private readonly formBuilder: FormBuilder = inject(FormBuilder);

  constructor() {
    this.formGroup = this.formBuilder.group({
      userAccountId: new FormControl(null, Validators.required),
      email: new FormControl(null, Validators.required),
      userId: new FormControl(null, Validators.required),
    });
  }

  ngOnInit() {
    const loadUserRequest = {
      email: this.formGroup.get('email')?.value,
    } as LoadUserRequest;
    this.store.loadUserList(loadUserRequest);
  }

  loadAccountList() {
    let userId = this.formGroup.get('userId')?.value;
    this.formGroup.patchValue({userAccountId: undefined});
    this.store.loadAccounts({userId: userId});
    this.userEvent.emit(this.store.users().find((e) => e.userId === userId));
  }

  emitUserAccount() {
    let userAccountId = this.formGroup.get('userAccountId')?.value;
    this.userAccountEvent.emit(
      this.store.userAccounts().find((e) => e.id === userAccountId),
    );
  }
}
