import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {PropertiesComponent} from './properties.component';
import {PropertyInvoice} from './property-invoice/property-invoice';
import {canActivateAuthAdminRole} from '../services/auth-guard';
import {PropertySettings} from './property-settings/property-settings';

const routes: Routes = [
  {
    path: '',
    component: PropertiesComponent,
    canActivate: [canActivateAuthAdminRole],
    data: {role: 'EXCHANGE_ADMIN'},
  },
  {
    path: 'property-invoice',
    component: PropertyInvoice,
    canActivate: [canActivateAuthAdminRole],
    data: {role: 'EXCHANGE_ADMIN'},
  },
  {
    path: 'property-settings',
    component: PropertySettings,
    canActivate: [canActivateAuthAdminRole],
    data: {role: 'EXCHANGE_ADMIN'},
  },
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PropertiesRoutingModule {
}
