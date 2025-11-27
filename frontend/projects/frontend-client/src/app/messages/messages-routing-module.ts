import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {canActivateAuthRole} from '../../services/auth-guard/auth-guard.service';
import {MessageComponent} from './message.component';
import {MessageList} from './message-list/message-list';

const routes: Routes = [
  {
    path: '',
    component: MessageComponent,
    canActivate: [canActivateAuthRole],
    data: {role: 'EXCHANGE_CLIENT'},
  },
  {
    path: 'message-list',
    component: MessageList,
    canActivate: [canActivateAuthRole],
    data: {role: 'EXCHANGE_CLIENT'},
  },
];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule],
})
export class MessagesRoutingModule {
}
