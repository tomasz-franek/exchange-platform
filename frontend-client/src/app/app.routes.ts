import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { provideEffects } from '@ngrx/effects';
import { TicketEffects } from './state/tickets/ticket.effect';
import { AppComponent } from './app.component';
import { AccountEffects } from './state/accounts/account.effect';

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
