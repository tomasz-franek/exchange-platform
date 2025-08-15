import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReportsRoutingModule } from './reports-routing.module';
import { ReportsComponent } from './reports.component';
import { ReportTransactions } from './report-transactions/report-transactions';

@NgModule({
  imports: [
    CommonModule,
    ReportsRoutingModule,
    ReportsComponent,
    ReportTransactions,
  ],
})
export class ReportsModule {}
