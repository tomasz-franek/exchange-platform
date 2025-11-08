import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EffectsModule, provideEffects } from '@ngrx/effects';
import { canActivateAuthRole } from '../../services/auth-guard/auth-guard.service';
import { PropertiesComponent } from './properties.component';
import { PropertiesEffects } from './state/properties.effects';
import { UserPropertyComponent } from './user-property/user-property.component';
import { PropertyAddressComponent } from './property-address/property-address.component';
import { StoreModule } from '@ngrx/store';
import {Features} from '../../../../shared-modules/src/lib/features';
import { propertyReducers } from './state/properties.reducers';

const routes: Routes = [
  {
    path: '',
    component: PropertiesComponent,
    canActivate: [canActivateAuthRole],
    data: { role: 'EXCHANGE_CLIENT' }
  },
  {
    path: 'user-property',
    providers: [provideEffects(PropertiesEffects)],
    component: UserPropertyComponent,
    canActivate: [canActivateAuthRole],
    data: { role: 'EXCHANGE_CLIENT' }
  },
  {
    path: 'property-address',
    providers: [provideEffects(PropertiesEffects)],
    component: PropertyAddressComponent,
    canActivate: [canActivateAuthRole],
    data: { role: 'EXCHANGE_CLIENT' }
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
    StoreModule.forFeature(Features.properties, propertyReducers),
    EffectsModule.forFeature([PropertiesEffects])
  ],
  exports: [RouterModule]
})
export class PropertiesRoutingModule {
}
