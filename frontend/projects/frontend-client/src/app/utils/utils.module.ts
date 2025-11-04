import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UtilsRoutingModule } from './utils-routing.module';
import { EffectsModule, provideEffects } from '@ngrx/effects';
import { UtilEffects } from './state/util.effects';
import { StoreModule } from '@ngrx/store';
import { utilReducers } from './state/util.reducers';
import { PropertiesEffects } from '../properties/state/properties.effects';
import {ButtonModule} from 'primeng/button';
import {FooterComponent} from '../../../../shared-modules/src/lib/footer/footer.component';
import {Features} from '../../../../shared-modules/src/lib/features';

@NgModule({
  imports: [
    CommonModule,
    UtilsRoutingModule,
    FooterComponent,
    ButtonModule,
    StoreModule.forFeature(Features.utils, utilReducers),
    EffectsModule.forFeature([UtilEffects, PropertiesEffects])
  ],
  providers: [provideEffects(UtilEffects, PropertiesEffects)]
})
export class UtilsModule {
}
