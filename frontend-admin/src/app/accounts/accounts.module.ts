import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AccountsRoutingModule } from './accounts-routing.module';
import { AccountsComponent } from './accounts.component';
import { TranslatePipe } from '@ngx-translate/core';
import { AccountFilter } from './account-filter/account-filter';
import { AccountListForm } from './account-list-form/account-list-form';
import { MenuComponent } from '../menu/menu.component';
import { AccountMenu } from './account-menu/account-menu';
import { AccountList } from './account-list/account-list';
import { AccountSystemComponent } from './account-system/account-system-component';
import { AccountSystemOperationListComponent } from './account-system-operation/account-system-operation-list-component';
import { CheckedMenu } from '../utils/checked-menu/checked-menu';
import { AccountBankComponent } from './account-bank/account-bank';

@NgModule({
  imports: [
    CommonModule,
    AccountsRoutingModule,
    AccountsComponent,
    TranslatePipe,
    MenuComponent,
    AccountMenu,
    AccountList,
    AccountFilter,
    CheckedMenu,
    AccountListForm,
    AccountSystemComponent,
    AccountSystemOperationListComponent,
    AccountBankComponent,
  ],
})
export class AccountsModule {}
