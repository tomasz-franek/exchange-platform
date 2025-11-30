import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {PropertiesComponent} from './properties.component';
import {canActivateAuthAdminRole} from '../../services/auth-guard';
import {PropertySettingsComponent} from './property-settings/property-settings';
import {PropertyAddressComponent} from './property-address/property-address';
import {PropertySystem} from './property-system/property-system';
import {PropertyCurrency} from './property-currency/property-currency';

const routes: Routes = [
  {
    path: '',
    component: PropertiesComponent,
    canActivate: [canActivateAuthAdminRole],
    data: {role: 'EXCHANGE_ADMIN'},
  },
  {
    path: 'address-property',
    component: PropertyAddressComponent,
    canActivate: [canActivateAuthAdminRole],
    data: {role: 'EXCHANGE_ADMIN'},
  },
  {
    path: 'user-property',
    component: PropertySettingsComponent,
    canActivate: [canActivateAuthAdminRole],
    data: {role: 'EXCHANGE_ADMIN'},
  },
  {
    path: 'system-property',
    component: PropertySystem,
    canActivate: [canActivateAuthAdminRole],
    data: {role: 'EXCHANGE_ADMIN'},
  },
  {
    path: 'system-currency',
    component: PropertyCurrency,
    canActivate: [canActivateAuthAdminRole],
    data: {role: 'EXCHANGE_ADMIN'},
  },
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
  ],
  exports: [RouterModule],
})
export class PropertiesRoutingModule {
}
