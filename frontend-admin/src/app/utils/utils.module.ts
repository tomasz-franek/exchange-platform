import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {UtilsRoutingModule} from './utils-routing.module';
import {FooterComponent} from './footer/footer.component';
import {VersionComponent} from './version/version.component';
import {provideEffects} from '@ngrx/effects';
import {UtilEffects} from './state/util.effects';
import {AccountEffects} from '../accounts/state/account.effects';
import {LandingPageComponent} from './landing-page/landing-page.component';
import {CheckedMenu} from './checked-menu/checked-menu';
import {DateRangePickerComponent} from './date-range-picker/date-range-picker-component';
import {MenuComponent} from '../menu/menu.component';
import {UserAccountComponent} from './user-account/user-account.component';

@NgModule({
  imports: [
    CommonModule,
    UtilsRoutingModule,
    FooterComponent,
    VersionComponent,
    LandingPageComponent,
    CheckedMenu,
    DateRangePickerComponent,
    MenuComponent,
    UserAccountComponent
  ],
  exports: [FooterComponent, VersionComponent, LandingPageComponent],
  providers: [provideEffects(UtilEffects, AccountEffects)],
})
export class UtilsModule {
}
