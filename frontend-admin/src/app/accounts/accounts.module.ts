import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {AccountsRoutingModule} from './accounts-routing.module';
import {AccountsComponent} from './accounts.component';
import {TranslatePipe} from "@ngx-translate/core";
import {StoreModule} from '@ngrx/store';
import {accountReducers} from './state/account.reducers';
import {AccountEffects} from './state/account.effects';
import {EffectsModule} from '@ngrx/effects';
import {Features} from '../features';


@NgModule({
  imports: [
    CommonModule,
    AccountsRoutingModule,
    AccountsComponent,
    TranslatePipe,
    StoreModule.forFeature(Features.accounts, accountReducers),
    EffectsModule.forFeature([AccountEffects]),
  ]
})
export class AccountsModule {
}
