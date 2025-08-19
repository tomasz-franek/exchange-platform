import { Component, inject, OnInit } from '@angular/core';
import { AccountMenu } from '../account-menu/account-menu';
import { MenuComponent } from '../../menu/menu.component';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { UserAccount } from '../../api/model/userAccount';
import { Store } from '@ngrx/store';
import {
  AccountState,
  selectSystemAccountList,
} from '../state/account.selectors';
import { CheckedMenu } from '../../utils/checked-menu/checked-menu';
import { loadSystemAccountListAction } from '../state/account.actions';
import { TranslatePipe } from '@ngx-translate/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-account-system',
  templateUrl: './account-system-component.html',
  styleUrl: './account-system-component.css',
  imports: [AccountMenu, MenuComponent, ReactiveFormsModule, TranslatePipe],
})
export class AccountSystemComponent extends CheckedMenu implements OnInit {
  formGroup: FormGroup;
  protected _account$: UserAccount[] = [];
  protected readonly router: Router = inject(Router);
  private _storeAccount$: Store<AccountState> = inject(Store);
  private formBuilder: FormBuilder = inject(FormBuilder);

  constructor() {
    super();
    this.formGroup = this.formBuilder.group({
      currency: new FormControl('', [Validators.required]),
    });
  }

  ngOnInit(): void {
    this._storeAccount$
      .select(selectSystemAccountList)
      .subscribe((accounts) => {
        this._account$ = accounts;
      });
    this._storeAccount$.dispatch(loadSystemAccountListAction());
  }

  showTransactions(id: string | undefined): void {
    if (id) {
      this.router.navigate(['/accounts/account-system-operations', id]);
    }
  }
}
