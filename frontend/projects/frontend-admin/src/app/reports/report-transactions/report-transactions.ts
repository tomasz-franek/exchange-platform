import { Component } from '@angular/core';
import { MenuComponent } from '../../menu/menu.component';
import { ReportMenu } from '../report-menu/report-menu';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-report-transactions',
  templateUrl: './report-transactions.html',
  styleUrl: './report-transactions.css',
  imports: [MenuComponent, ReportMenu, TranslatePipe],
})
export class ReportTransactions {
  getTransactionReport() {}
}
