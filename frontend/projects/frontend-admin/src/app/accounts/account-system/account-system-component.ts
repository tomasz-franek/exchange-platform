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
import { CheckedMenu } from 'shared-modules';
import { TranslatePipe } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { TableModule } from 'primeng/table';
import { SelectButton } from 'primeng/selectbutton';
import { Button } from 'primeng/button';
import { AccountsStore } from '../accounts.signal-store';

@Component({
  selector: 'app-account-system',
  templateUrl: './account-system-component.html',
  styleUrl: './account-system-component.scss',
  imports: [
    AccountMenu,
    MenuComponent,
    ReactiveFormsModule,
    TranslatePipe,
    TableModule,
    SelectButton,
    Button,
  ],
})
export class AccountSystemComponent extends CheckedMenu implements OnInit {
  formGroup: FormGroup;
  stateOptions: any[] = [];
  protected readonly router: Router = inject(Router);
  protected readonly store = inject(AccountsStore);
  private readonly formBuilder: FormBuilder = inject(FormBuilder);

  constructor() {
    super();
    this.stateOptions = [
      {
        value: 'system',
        label: this.translateService.instant('SYSTEM_ACCOUNTS'),
      },
      {
        value: 'exchange',
        label: this.translateService.instant('EXCHANGE_ACCOUNTS'),
      },
    ];
    this.formGroup = this.formBuilder.group({
      currency: new FormControl('', [Validators.required]),
      accountType: new FormControl('system', [Validators.required]),
    });
  }

  ngOnInit(): void {
    this.readAccounts();
  }

  readAccounts() {
    this.store.loadSystemAccountList(this.formGroup.get('accountType')?.value);
  }

  showTransactions(id: string | undefined): void {
    if (id != undefined) {
      this.router.navigate(['accounts/account-operations', id]);
    }
  }
}
