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
import {MenuComponent} from '../menu/menu.component';
import {PropertyMenu} from './property-menu/property-menu';


@NgModule({
  imports: [
    CommonModule,
    PropertiesRoutingModule,
    PropertiesComponent,
    PropertyMenu,
    TranslatePipe,
    MenuComponent,
    StoreModule.forFeature(Features.properties, propertyReducers),
    EffectsModule.forFeature([PropertiesEffects])
  ]
})
export class PropertiesModule {
}
