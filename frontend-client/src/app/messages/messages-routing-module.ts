import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { provideEffects } from '@ngrx/effects';
import { canActivateAuthRole } from '../../services/auth-guard/auth-guard.service';
import { MessageComponent } from './message.component';
import { MessageEffects } from './state/message.effects';

const routes: Routes = [{
  path: '',
  providers: [provideEffects(MessageEffects)],
  component: MessageComponent,
  canActivate: [canActivateAuthRole],
  data: { role: 'EXCHANGE_CLIENT' }
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MessagesRoutingModule {
}
