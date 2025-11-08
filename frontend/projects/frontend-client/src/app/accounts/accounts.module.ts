import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AccountsComponent } from './accounts.component';
import { AccountsRoutingModule } from './accounts-routing.module';
import { AccountMenu } from './account-menu/account-menu';
import { AccountBankComponent } from './account-bank/account-bank';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    AccountsComponent,
    AccountMenu,
    AccountsRoutingModule,
    AccountBankComponent
  ]
})
export class AccountsModule {
}
