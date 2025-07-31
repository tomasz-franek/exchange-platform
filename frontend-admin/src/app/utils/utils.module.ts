import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {UtilsRoutingModule} from './utils-routing.module';
import {FooterComponent} from './utils-footer/footer.component';
import {VersionComponent} from './utils-version/version.component';

@NgModule({
  imports: [
    CommonModule,
    UtilsRoutingModule,
    FooterComponent,
    VersionComponent
  ],
  exports: [
    FooterComponent,
    VersionComponent,
  ]
})
export class UtilsModule {
}
