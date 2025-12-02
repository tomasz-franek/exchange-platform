import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {MessagesComponent} from './messages.component';
import {MessageListForm} from './message-list-form/message-list-form';
import {canActivateAuthAdminRole} from '../../services/auth-guard';
import {MessageAdd} from './message-add/message-add';

const routes: Routes = [
  {
    path: '',
    component: MessagesComponent,
    canActivate: [canActivateAuthAdminRole],
    data: {role: 'EXCHANGE_ADMIN'},
  },
  {
    path: 'message-list',
    component: MessageListForm,
    canActivate: [canActivateAuthAdminRole],
    data: {role: 'EXCHANGE_ADMIN'},
  },
  {
    path: 'message-add',
    component: MessageAdd,
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
export class MessagesRoutingModule {
}
