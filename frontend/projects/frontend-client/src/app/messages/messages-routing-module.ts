import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EffectsModule, provideEffects } from '@ngrx/effects';
import { canActivateAuthRole } from '../../services/auth-guard/auth-guard.service';
import { MessageComponent } from './message.component';
import { MessageEffects } from './state/message.effects';
import { StoreModule } from '@ngrx/store';
import {Features} from '../../../../shared-modules/src/lib/features';
import { messageReducers } from './state/message.reducers';
import { MessageList } from './message-list/message-list';

const routes: Routes = [
  {
    path: '',
    providers: [provideEffects(MessageEffects)],
    component: MessageComponent,
    canActivate: [canActivateAuthRole],
    data: { role: 'EXCHANGE_CLIENT' },
  },
  {
    path: 'message-list',
    providers: [provideEffects(MessageEffects)],
    component: MessageList,
    canActivate: [canActivateAuthRole],
    data: { role: 'EXCHANGE_CLIENT' },
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
