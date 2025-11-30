import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {PropertiesRoutingModule} from './properties-routing.module';
import {PropertiesComponent} from './properties.component';
import {TranslatePipe} from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    PropertiesRoutingModule,
    PropertiesComponent,
    TranslatePipe,
  ],
  exports: [],
})
export class PropertiesModule {
}
