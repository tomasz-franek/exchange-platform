import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { canActivateAuthAdminRole } from '../services/auth-guard';
import { EffectsModule } from '@ngrx/effects';
import { LandingPageComponent } from './utils/landing-page/landing-page.component';
import { DashboardComponent } from './utils/dashboard/dashboard.component';
import { ForbiddenComponent, NotFoundComponent } from 'shared-modules';
import { MessagesComponent } from './messages/messages.component';
import { MessageListForm } from './messages/message-list-form/message-list-form';
import { MessageAdd } from './messages/message-add/message-add';
import { PropertiesComponent } from './properties/properties.component';
import { PropertyAddressComponent } from './properties/property-address/property-address';
import { PropertySettingsComponent } from './properties/property-settings/property-settings';
import { PropertySystem } from './properties/property-system/property-system';
import { PropertyCurrency } from './properties/property-currency/property-currency';
import { ReportsComponent } from './reports/reports.component';
import { ReportTransactions } from './reports/report-transactions/report-transactions';
import { ReportErrors } from './reports/report-errors/report-errors';
import { StatisticsComponent } from './statistics/statistics.component';
import { StatisticPair } from './statistics/statistic-pair/statistic-pair';
import { StatisticTransaction } from './statistics/statistic-transaction/statistic-transaction';
import { StatisticCurrency } from './statistics/statistic-currency/statistic-currency';
import { StatisticUser } from './statistics/statistic-user/statistic-user';
import { MonitoringComponent } from './monitoring/monitoring.component';
import { MonitoringNodesComponent } from './monitoring/monitoring-nodes/monitoring-nodes.component';
import { AccountsComponent } from './accounts/accounts.component';
import { AccountDepositComponent } from './accounts/account-deposit/account-deposit.component';
import { AccountListForm } from './accounts/account-list-form/account-list-form';
import { AccountSystemComponent } from './accounts/account-system/account-system-component';
import { AccountSystemOperationListComponent } from './accounts/account-system-operation/account-system-operation-list-component';
import { AccountBankComponent } from './accounts/account-bank/account-bank';
import { AccountCorrection } from './accounts/account-correction/account-correction';
import { TransactionsComponent } from './transactions/transactions.component';
import { TransactionListForm } from './transactions/transaction-list-form/transaction-list-form';
import { TransactionSystemAccount } from './transactions/transaction-system-account/transaction-system-account';
import { TransactionExchangeAccount } from './transactions/transaction-exchange-account/transaction-exchange-account';
import { ReportPair } from './reports/report-pair/report-pair';
import { PropertyWithdraw } from './properties/property-withdraw/property-withdraw';

export const routes: Route[] = [
  {
    path: '',
    component: LandingPageComponent,
  },
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [canActivateAuthAdminRole],
    data: { role: 'EXCHANGE_ADMIN' },
  },
  {
    path: 'accounts',
    canActivate: [canActivateAuthAdminRole],
    data: { role: 'EXCHANGE_ADMIN' },
    children: [
      {
        path: '',
        component: AccountsComponent,
        canActivate: [canActivateAuthAdminRole],
        data: { role: 'EXCHANGE_ADMIN' },
      },
      {
        path: 'account-deposit',
        component: AccountDepositComponent,
        canActivate: [canActivateAuthAdminRole],
        data: { role: 'EXCHANGE_ADMIN' },
      },
      {
        path: 'account-list',
        component: AccountListForm,
        canActivate: [canActivateAuthAdminRole],
        data: { role: 'EXCHANGE_ADMIN' },
      },
      {
        path: 'account-system',
        component: AccountSystemComponent,
        canActivate: [canActivateAuthAdminRole],
        data: { role: 'EXCHANGE_ADMIN' },
      },
      {
        path: 'account-operations/:id',
        component: AccountSystemOperationListComponent,
        canActivate: [canActivateAuthAdminRole],
        data: { role: 'EXCHANGE_ADMIN' },
      },
      {
        path: 'account-operations',
        component: AccountSystemOperationListComponent,
        canActivate: [canActivateAuthAdminRole],
        data: { role: 'EXCHANGE_ADMIN' },
      },
      {
        path: 'bank-accounts',
        component: AccountBankComponent,
        canActivate: [canActivateAuthAdminRole],
        data: { role: 'EXCHANGE_ADMIN' },
      },
      {
        path: 'account-correction',
        component: AccountCorrection,
        canActivate: [canActivateAuthAdminRole],
        data: { role: 'EXCHANGE_ADMIN' },
      },
    ],
  },
  {
    path: 'transactions',
    canActivate: [canActivateAuthAdminRole],
    data: { role: 'EXCHANGE_ADMIN' },
    children: [
      {
        path: '',
        component: TransactionsComponent,
        canActivate: [canActivateAuthAdminRole],
        data: { role: 'EXCHANGE_ADMIN' },
      },
      {
        path: 'transaction-list',
        component: TransactionListForm,
        canActivate: [canActivateAuthAdminRole],
        data: { role: 'EXCHANGE_ADMIN' },
      },
      {
        path: 'transaction-system-account',
        component: TransactionSystemAccount,
        canActivate: [canActivateAuthAdminRole],
        data: { role: 'EXCHANGE_ADMIN' },
      },
      {
        path: 'transaction-exchange-account',
        component: TransactionExchangeAccount,
        canActivate: [canActivateAuthAdminRole],
        data: { role: 'EXCHANGE_ADMIN' },
      },
    ],
  },
  {
    path: 'reports',
    canActivate: [canActivateAuthAdminRole],
    data: { role: 'EXCHANGE_ADMIN' },
    children: [
      {
        path: '',
        component: ReportsComponent,
        canActivate: [canActivateAuthAdminRole],
        data: { role: 'EXCHANGE_ADMIN' },
      },
      {
        path: 'report-transactions',
        component: ReportTransactions,
        canActivate: [canActivateAuthAdminRole],
        data: { role: 'EXCHANGE_ADMIN' },
      },
      {
        path: 'report-errors',
        component: ReportErrors,
        canActivate: [canActivateAuthAdminRole],
        data: { role: 'EXCHANGE_ADMIN' },
      },
      {
        path: 'report-pair',
        component: ReportPair,
        canActivate: [canActivateAuthAdminRole],
        data: { role: 'EXCHANGE_ADMIN' },
      },
    ],
  },
  {
    path: 'messages',
    canActivate: [canActivateAuthAdminRole],
    data: { role: 'EXCHANGE_ADMIN' },
    children: [
      {
        path: '',
        component: MessagesComponent,
        canActivate: [canActivateAuthAdminRole],
        data: { role: 'EXCHANGE_ADMIN' },
      },
      {
        path: 'message-list',
        component: MessageListForm,
        canActivate: [canActivateAuthAdminRole],
        data: { role: 'EXCHANGE_ADMIN' },
      },
      {
        path: 'message-add',
        component: MessageAdd,
        canActivate: [canActivateAuthAdminRole],
        data: { role: 'EXCHANGE_ADMIN' },
      },
    ],
  },
  {
    path: 'properties',
    canActivate: [canActivateAuthAdminRole],
    data: { role: 'EXCHANGE_ADMIN' },
    children: [
      {
        path: '',
        component: PropertiesComponent,
        canActivate: [canActivateAuthAdminRole],
        data: { role: 'EXCHANGE_ADMIN' },
      },
      {
        path: 'address-property',
        component: PropertyAddressComponent,
        canActivate: [canActivateAuthAdminRole],
        data: { role: 'EXCHANGE_ADMIN' },
      },
      {
        path: 'user-property',
        component: PropertySettingsComponent,
        canActivate: [canActivateAuthAdminRole],
        data: { role: 'EXCHANGE_ADMIN' },
      },
      {
        path: 'system-property',
        component: PropertySystem,
        canActivate: [canActivateAuthAdminRole],
        data: { role: 'EXCHANGE_ADMIN' },
      },
      {
        path: 'system-currency',
        component: PropertyCurrency,
        canActivate: [canActivateAuthAdminRole],
        data: { role: 'EXCHANGE_ADMIN' },
      },
      {
        path: 'system-withdraw',
        component: PropertyWithdraw,
        canActivate: [canActivateAuthAdminRole],
        data: {role: 'EXCHANGE_ADMIN'},
      },
    ],
  },
  {
    path: 'statistics',
    canActivate: [canActivateAuthAdminRole],
    data: { role: 'EXCHANGE_ADMIN' },
    children: [
      {
        path: '',
        component: StatisticsComponent,
        canActivate: [canActivateAuthAdminRole],
        data: { role: 'EXCHANGE_ADMIN' },
      },
      {
        path: 'statistic-pair',
        component: StatisticPair,
        canActivate: [canActivateAuthAdminRole],
        data: { role: 'EXCHANGE_ADMIN' },
      },
      {
        path: 'statistic-transaction',
        component: StatisticTransaction,
        canActivate: [canActivateAuthAdminRole],
        data: { role: 'EXCHANGE_ADMIN' },
      },
      {
        path: 'statistic-currency',
        component: StatisticCurrency,
        canActivate: [canActivateAuthAdminRole],
        data: { role: 'EXCHANGE_ADMIN' },
      },
      {
        path: 'statistic-user',
        component: StatisticUser,
        canActivate: [canActivateAuthAdminRole],
        data: { role: 'EXCHANGE_ADMIN' },
      },
    ],
  },
  {
    path: 'monitoring',
    canActivate: [canActivateAuthAdminRole],
    data: { role: 'EXCHANGE_ADMIN' },
    children: [
      { path: '', component: MonitoringComponent },
      {
        path: 'nodes',
        component: MonitoringNodesComponent,
      },
    ],
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
  imports: [RouterModule.forRoot(routes), EffectsModule.forRoot([])],
  exports: [RouterModule],
})
export class AppRoutingModule {}
