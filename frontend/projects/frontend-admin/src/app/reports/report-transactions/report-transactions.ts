import {Component} from '@angular/core';
import {MenuComponent} from '../../menu/menu.component';
import {ReportMenu} from '../report-menu/report-menu';
import {TranslatePipe} from '@ngx-translate/core';
import {Button} from 'primeng/button';

@Component({
  selector: 'app-report-transactions',
  templateUrl: './report-transactions.html',
  styleUrl: './report-transactions.scss',
  imports: [MenuComponent, ReportMenu, TranslatePipe, Button],
})
export class ReportTransactions {
  getTransactionReport() {
  }
}
