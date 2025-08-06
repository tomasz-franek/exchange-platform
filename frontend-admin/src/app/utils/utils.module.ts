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
import {LandingPageComponent} from './landing-page/landing-page.component';

@NgModule({
  imports: [
    CommonModule,
    UtilsRoutingModule,
    FooterComponent,
    VersionComponent,
    LandingPageComponent,
    StoreModule.forFeature(Features.utils, {
      accounts: accountReducers
    }),
    EffectsModule.forFeature([AccountEffects, UtilEffects]),
  ],
  exports: [
    FooterComponent,
    VersionComponent,
    LandingPageComponent
  ],
  providers: [provideEffects(UtilEffects, AccountEffects)],
})
export class UtilsModule {
}
