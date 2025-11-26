import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {PropertiesRoutingModule} from './properties-routing.module';
import {PropertiesComponent} from './properties.component';
import {TranslatePipe} from '@ngx-translate/core';
import {StoreModule} from '@ngrx/store';
import {Features} from '../../../../shared-modules/src/lib/features';
import {propertyReducers} from './state/properties.reducers';

@NgModule({
  imports: [
    CommonModule,
    PropertiesRoutingModule,
    PropertiesComponent,
    TranslatePipe,
    StoreModule.forFeature(Features.properties, propertyReducers),
  ],
  exports: [],
})
export class PropertiesModule {
}
