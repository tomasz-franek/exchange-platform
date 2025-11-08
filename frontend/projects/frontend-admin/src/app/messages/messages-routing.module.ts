import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {MessagesComponent} from './messages.component';
import {StoreModule} from '@ngrx/store';
import { Features} from '../../../../shared-modules/src/lib/features';
import {messageReducers} from './state/message.reducers';
import {EffectsModule, provideEffects} from '@ngrx/effects';
import {MessageEffects} from './state/message.effects';
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
    providers: [provideEffects(MessageEffects)],
    canActivate: [canActivateAuthAdminRole],
    data: {role: 'EXCHANGE_ADMIN'},
  },
  {
    path: 'message-add',
    component: MessageAdd,
    providers: [provideEffects(MessageEffects)],
    canActivate: [canActivateAuthAdminRole],
    data: {role: 'EXCHANGE_ADMIN'},
  },
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
    StoreModule.forFeature(Features.messages, messageReducers),
    EffectsModule.forFeature([MessageEffects]),
  ],
  exports: [RouterModule],
})
export class MessagesRoutingModule {
}
