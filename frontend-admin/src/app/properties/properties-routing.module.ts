import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PropertiesComponent } from './properties.component';
import { canActivateAuthAdminRole } from '../../services/auth-guard';
import { PropertySettingsComponent } from './property-settings/property-settings';
import { EffectsModule, provideEffects } from '@ngrx/effects';
import { PropertiesEffects } from './state/properties.effects';
import { StoreModule } from '@ngrx/store';
import { Features } from '../features';
import { propertyReducers } from './state/properties.reducers';
import { PropertyAddressComponent } from './property-address/property-address';
import { PropertySystem } from './property-system/property-system';

const routes: Routes = [
  {
    path: '',
    component: PropertiesComponent,
    canActivate: [canActivateAuthAdminRole],
    data: { role: 'EXCHANGE_ADMIN' },
  },
  {
    path: 'address-property',
    component: PropertyAddressComponent,
    canActivate: [canActivateAuthAdminRole],
    data: { role: 'EXCHANGE_ADMIN' },
  },
  {
    path: 'user-property',
    providers: [provideEffects(PropertiesEffects)],
    component: PropertySettingsComponent,
    canActivate: [canActivateAuthAdminRole],
    data: { role: 'EXCHANGE_ADMIN' },
  },
  {
    path: 'system-property',
    providers: [provideEffects(PropertiesEffects)],
    component: PropertySystem,
    canActivate: [canActivateAuthAdminRole],
    data: { role: 'EXCHANGE_ADMIN' },
  },
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
    StoreModule.forFeature(Features.properties, propertyReducers),
    EffectsModule.forFeature([PropertiesEffects]),
  ],
  exports: [RouterModule],
})
export class PropertiesRoutingModule {}
