import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {PropertiesRoutingModule} from './properties-routing.module';
import {PropertiesComponent} from './properties.component';
import {TranslatePipe} from "@ngx-translate/core";
import {StoreModule} from '@ngrx/store';
import {propertyReducers} from './state/properties.reducers';
import {EffectsModule} from '@ngrx/effects';
import {PropertiesEffects} from './state/properties.effects';
import {Features} from '../features';


@NgModule({
  imports: [
    CommonModule,
    PropertiesRoutingModule,
    PropertiesComponent,
    TranslatePipe,
    StoreModule.forFeature(Features.properties, propertyReducers),
    EffectsModule.forFeature([PropertiesEffects])
  ]
})
export class PropertiesModule {
}
