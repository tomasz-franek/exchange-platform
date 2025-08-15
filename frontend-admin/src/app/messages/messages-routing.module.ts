import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MessagesComponent } from './messages.component';
import { StoreModule } from '@ngrx/store';
import { Features } from '../features';
import { messageReducers } from './state/message.reducers';
import { EffectsModule, provideEffects } from '@ngrx/effects';
import { MessageEffects } from './state/message.effects';
import { MessageListForm } from './message-list-form/message-list-form';
import { canActivateAuthAdminRole } from '../../services/auth-guard';

const routes: Routes = [
  {
    path: '',
    component: MessagesComponent,
    canActivate: [canActivateAuthAdminRole],
    data: { role: 'EXCHANGE_ADMIN' },
  },
  {
    path: 'message-list',
    component: MessageListForm,
    providers: [provideEffects(MessageEffects)],
    canActivate: [canActivateAuthAdminRole],
    data: { role: 'EXCHANGE_ADMIN' },
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
export class MessagesRoutingModule {}
