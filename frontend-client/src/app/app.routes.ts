import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { provideEffects } from '@ngrx/effects';
import { AccountEffects } from './state/accounts/account.effect';
import { TicketEffects } from './state/tickets/ticket.effect';

export const routes: Routes = [
  {
    path: '',
    providers: [provideEffects(TicketEffects, AccountEffects)],
    component: AppComponent,
  },
  {
    path: '**',
    providers: [provideEffects(TicketEffects, AccountEffects)],
    component: AppComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
