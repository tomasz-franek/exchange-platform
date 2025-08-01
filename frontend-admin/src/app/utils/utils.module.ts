import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {UtilsRoutingModule} from './utils-routing.module';
import {FooterComponent} from './footer/footer.component';
import {VersionComponent} from './version/version.component';
import {EffectsModule, provideEffects} from '@ngrx/effects';
import {UtilEffects} from './state/util.effects';
import {Features} from '../features';
import {StoreModule} from '@ngrx/store';
import {AccountEffects} from '../accounts/state/account.effects';
import {accountReducers} from '../accounts/state/account.reducers';

@NgModule({
  imports: [
    CommonModule,
    UtilsRoutingModule,
    FooterComponent,
    VersionComponent,
    StoreModule.forFeature(Features.utils, {
      accounts: accountReducers
    }),
    EffectsModule.forFeature([AccountEffects, UtilEffects]),
  ],
  exports: [
    FooterComponent,
    VersionComponent,
  ],
  providers: [provideEffects(UtilEffects, AccountEffects)]
})
export class UtilsModule {
}
