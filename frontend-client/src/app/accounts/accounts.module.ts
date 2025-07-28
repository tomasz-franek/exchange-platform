import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AccountsComponent } from './accounts.component';
import { AccountsRoutingModule } from './accounts-routing.module';
import { AccountMenu } from './account-menu/account-menu';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    AccountsComponent,
    AccountMenu,
    AccountsRoutingModule,
  ],
})
export class AccountsModule {}
