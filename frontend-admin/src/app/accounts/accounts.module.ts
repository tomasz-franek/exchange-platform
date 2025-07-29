import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {AccountsRoutingModule} from './accounts-routing.module';
import {AccountsComponent} from './accounts.component';
import {TranslatePipe} from "@ngx-translate/core";


@NgModule({
  imports: [
    CommonModule,
    AccountsRoutingModule,
    AccountsComponent,
    TranslatePipe
  ]
})
export class AccountsModule {
}
