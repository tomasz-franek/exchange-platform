import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AccountsRoutingModule } from './accounts-routing.module';
import { AccountsComponent } from './accounts.component';
import { TranslatePipe } from '@ngx-translate/core';
import { StoreModule } from '@ngrx/store';
import { accountReducers } from './state/account.reducers';
import { AccountEffects } from './state/account.effects';
import { EffectsModule } from '@ngrx/effects';
import { Features } from '../features';
import { AccountFilter } from './account-filter/account-filter';
import { AccountListForm } from './account-list-form/account-list-form';
import { MenuComponent } from '../menu/menu.component';
import { AccountMenu } from './account-menu/account-menu';
import { AccountList } from './account-list/account-list';
import { AccountSystemComponent } from './account-system/account-system-component';
import { AccountSystemOperationListComponent } from './account-system-operation/account-system-operation-list-component';

@NgModule({
  imports: [
    CommonModule,
    AccountsRoutingModule,
    AccountsComponent,
    TranslatePipe,
    StoreModule.forFeature(Features.accounts, accountReducers),
    EffectsModule.forFeature([AccountEffects]),
    MenuComponent,
    AccountMenu,
    AccountList,
    AccountFilter,
    AccountListForm,
    AccountSystemComponent,
    AccountSystemOperationListComponent,
  ],
})
export class AccountsModule {}
