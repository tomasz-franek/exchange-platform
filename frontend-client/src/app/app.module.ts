import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app.routes';
import { AppComponent } from './app.component';
import { StoreModule } from '@ngrx/store';
import { bootstrapApplication } from '@angular/platform-browser';
import * as echarts from 'echarts/core';
import { BarChart } from 'echarts/charts';
import { NgxEchartsModule } from 'ngx-echarts';
import { TranslateModule } from '@ngx-translate/core';

import { EffectsModule } from '@ngrx/effects';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { AccountListComponent } from './account-list/account-list.component';
import { DepositComponent } from './deposit/deposit.component';
import { OrderBookChartComponent } from './order-book-chart/order-book-chart.component';
import { OrderBookTableComponent } from './order-book-table/order-book-table.component';
import { accountReducers } from './state/account/account.reducers';
import { ticketReducers } from './state/ticket/ticket.reducers';
import { TicketEffects } from './state/ticket/ticket.effects';
import { AccountEffects } from './state/account/account.effects';

echarts.use([BarChart]);

@NgModule({
  declarations: [],
  imports: [
    BrowserAnimationsModule,
    AppRoutingModule,
    AppComponent,
    AccountListComponent,
    DepositComponent,
    OrderBookChartComponent,
    OrderBookTableComponent,
    StoreModule.forRoot({
      accountReducer: accountReducers,
      ticketReducer: ticketReducers,
    }),
    TranslateModule.forRoot(),
    NgxEchartsModule.forRoot({ echarts }),
    StoreDevtoolsModule.instrument({
      maxAge: 50,
    }),
    EffectsModule.forRoot([AccountEffects, TicketEffects]),
  ],
})
export class AppModule {}

bootstrapApplication(AppComponent);
