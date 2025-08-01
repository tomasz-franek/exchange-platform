import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PropertiesRoutingModule } from './properties-routing.module';
import { PropertiesComponent } from './properties.component';
import { TranslatePipe } from '@ngx-translate/core';
import { StoreModule } from '@ngrx/store';
import { EffectsModule, provideEffects } from '@ngrx/effects';
import { PropertiesEffects } from './state/properties.effects';
import { Features } from '../features';
import { propertyReducers } from './state/properties.reducers';
import { utilReducers } from '../utils/state/util.reducers';
import { UtilEffects } from '../utils/state/util.effects';

@NgModule({
  imports: [
    CommonModule,
    PropertiesRoutingModule,
    PropertiesComponent,
    TranslatePipe,
    StoreModule.forFeature(Features.properties, {
      utils: utilReducers,
      properties: propertyReducers
    }),
    EffectsModule.forFeature([PropertiesEffects, UtilEffects])
  ],
  exports: [],
  providers: [provideEffects(UtilEffects, PropertiesEffects)]
})
export class PropertiesModule {
}
