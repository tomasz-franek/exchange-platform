import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReportsRoutingModule } from './reports-routing.module';
import { ReportsComponent } from './reports.component';
import { ReportTransactions } from './report-transactions/report-transactions';
import { ReportErrors } from './report-errors/report-errors';

@NgModule({
  imports: [
    CommonModule,
    ReportsRoutingModule,
    ReportsComponent,
    ReportTransactions,
    ReportErrors,
  ],
})
export class ReportsModule {}
