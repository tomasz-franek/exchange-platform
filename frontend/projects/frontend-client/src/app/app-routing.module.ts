import {RouterModule, Routes} from '@angular/router';
import {NgModule} from '@angular/core';
import {EffectsModule} from '@ngrx/effects';
import {canActivateAuthRole} from '../services/auth-guard/auth-guard.service';
import {ForbiddenComponent} from '../../../shared-modules/src/lib/forbidden/forbidden.component';
import {NotFoundComponent} from '../../../shared-modules/src/lib/not-found/not-found.component';
import {DashboardComponent} from './utils/dashboard/dashboard.component';
import {LandingPageComponent} from './utils/landing-page/landing-page.component';
import {TicketsComponent} from './tickets/tickets.component';
import {TicketListComponent} from './tickets/ticket-list/ticket-list.component';
import {TicketOrderComponent} from './tickets/ticket-order/ticket-order.component';
import {TicketRealizedComponent} from './tickets/ticket-realized/ticket-realized.component';
import {AccountsComponent} from './accounts/accounts.component';
import {AccountListComponent} from './accounts/account-list/account-list.component';
import {AccountEditComponent} from './accounts/account-edit/account-edit.component';
import {AccountWithdrawComponent} from './accounts/account-withdraw/account-withdraw.component';
import {AccountBankComponent} from './accounts/account-bank/account-bank';
import {MessageList} from './messages/message-list/message-list';
import {MessageComponent} from './messages/message.component';
import {RatesComponent} from './rates/rates.component';
import {RateList} from './rates/rates-list/rate-list';
import {ReportsComponent} from './reports/reports.component';
import {FinancialReportComponent} from './reports/financial-report/financial-report.component';
import {PropertiesComponent} from './properties/properties.component';
import {UserPropertyComponent} from './properties/user-property/user-property.component';
import {PropertyAddressComponent} from './properties/property-address/property-address.component';

export const routes: Routes = [
  {
    path: '',
    component: LandingPageComponent,
  },
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [canActivateAuthRole],
    data: {role: 'EXCHANGE_CLIENT'},
  },
  {
    path: 'tickets',
    canActivate: [canActivateAuthRole],
    data: {role: 'EXCHANGE_CLIENT'},
    children: [
      {
        path: '',
        component: TicketsComponent,
        canActivate: [canActivateAuthRole],
        data: {role: 'EXCHANGE_CLIENT'}
      },
      {
        path: 'ticket-list',
        component: TicketListComponent,
        canActivate: [canActivateAuthRole],
        data: {role: 'EXCHANGE_CLIENT'}
      },
      {
        path: 'ticket-order',
        component: TicketOrderComponent,
        canActivate: [canActivateAuthRole],
        data: {role: 'EXCHANGE_CLIENT'}
      },
      {
        path: 'ticket-realized',
        component: TicketRealizedComponent,
        canActivate: [canActivateAuthRole],
        data: {role: 'EXCHANGE_CLIENT'}
      }
    ]
  },
  {
    path: 'accounts',
    canActivate: [canActivateAuthRole],
    data: {role: 'EXCHANGE_CLIENT'},
    children: [
      {
        path: '',
        component: AccountsComponent,
        canActivate: [canActivateAuthRole],
        data: {role: 'EXCHANGE_CLIENT'}
      },
      {
        path: 'account-list',
        component: AccountListComponent,
        canActivate: [canActivateAuthRole],
        data: {role: 'EXCHANGE_CLIENT'}
      },
      {
        path: 'account-edit',
        component: AccountEditComponent,
        canActivate: [canActivateAuthRole],
        data: {role: 'EXCHANGE_CLIENT'}
      },
      {
        path: 'account-withdraw',
        component: AccountWithdrawComponent,
        canActivate: [canActivateAuthRole],
        data: {role: 'EXCHANGE_CLIENT'}
      },
      {
        path: 'bank-accounts',
        component: AccountBankComponent,
        canActivate: [canActivateAuthRole],
        data: {role: 'EXCHANGE_CLIENT'}
      }
    ]
  },
  {
    path: 'messages',
    canActivate: [canActivateAuthRole],
    data: {role: 'EXCHANGE_CLIENT'},
    children: [
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
    ]
  },
  {
    path: 'rates',
    canActivate: [canActivateAuthRole],
    data: {role: 'EXCHANGE_CLIENT'},
    children: [
      {
        path: '',
        component: RatesComponent,
        canActivate: [canActivateAuthRole],
        data: {role: 'EXCHANGE_CLIENT'},
      },
      {
        path: 'rate-list',
        component: RateList,
        canActivate: [canActivateAuthRole],
        data: {role: 'EXCHANGE_CLIENT'},
      },
    ]
  },
  {
    path: 'reports',
    canActivate: [canActivateAuthRole],
    data: {role: 'EXCHANGE_CLIENT'},
    children: [
      {
        path: '',
        component: ReportsComponent,
        canActivate: [canActivateAuthRole],
        data: {role: 'EXCHANGE_CLIENT'}
      },
      {
        path: 'financial-report',
        component: FinancialReportComponent,
        canActivate: [canActivateAuthRole],
        data: {role: 'EXCHANGE_CLIENT'}
      }
    ]
  },
  {
    path: 'properties',
    canActivate: [canActivateAuthRole],
    data: {role: 'EXCHANGE_CLIENT'},
    children: [
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
    ]
  },

  {
    path: 'forbidden',
    component: ForbiddenComponent,
  },
  {
    path: '**',
    component: NotFoundComponent,
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes),
    EffectsModule.forRoot([]),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {
}
