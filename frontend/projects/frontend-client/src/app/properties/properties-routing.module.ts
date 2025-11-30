import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {canActivateAuthRole} from '../../services/auth-guard/auth-guard.service';
import {PropertiesComponent} from './properties.component';
import {UserPropertyComponent} from './user-property/user-property.component';
import {PropertyAddressComponent} from './property-address/property-address.component';

const routes: Routes = [
  {
    path: '',
    component: PropertiesComponent,
    canActivate: [canActivateAuthRole],
    data: {role: 'EXCHANGE_CLIENT'}
  },
  {
    path: 'user-property',
    component: UserPropertyComponent,
    canActivate: [canActivateAuthRole],
    data: {role: 'EXCHANGE_CLIENT'}
  },
  {
    path: 'property-address',
    component: PropertyAddressComponent,
    canActivate: [canActivateAuthRole],
    data: {role: 'EXCHANGE_CLIENT'}
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
  ],
  exports: [RouterModule]
})
export class PropertiesRoutingModule {
}
