import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {PropertiesRoutingModule} from './properties-routing.module';
import {PropertiesComponent} from './properties.component';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    PropertiesRoutingModule,
    PropertiesComponent
  ]
})
export class PropertiesModule {
}
