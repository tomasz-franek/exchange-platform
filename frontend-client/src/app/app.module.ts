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
import { AccountEffects } from './state/accounts/account.effects';
import { EffectsModule } from '@ngrx/effects';
import { TicketEffects } from './state/tickets/ticket.effects';
import { accountReducer } from './state/accounts/account.reducers';
import { ticketReducer } from './state/tickets/ticket.reducers';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { AccountListComponent } from './account-list/account-list.component';
import { DepositComponent } from './deposit/deposit.component';
import { OrderBookChartComponent } from './order-book-chart/order-book-chart.component';
import { OrderBookTableComponent } from './order-book-table/order-book-table.component';

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
      accountReducer: accountReducer,
      ticketReducer: ticketReducer,
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
