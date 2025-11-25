import {Component, inject, OnInit} from '@angular/core';
import {TicketMenu} from '../ticket-menu/ticket-menu';
import {AmountPipe} from '../../../pipes/amount-pipe/amount.pipe';
import {RatioPipe} from '../../../pipes/ratio-pipe/ratio.pipe';
import {TranslatePipe} from '@ngx-translate/core';
import {UserTicket} from '../../api/model/userTicket';
import {MenuComponent} from '../../menu/menu.component';
import {CurrencyUtils} from '../../utils/currency-utils';
import {Button} from 'primeng/button';
import {TableModule} from 'primeng/table';
import {TicketStore} from '../tickets.signal-store';

@Component({
  selector: 'app-ticket-realized',
  imports: [
    TicketMenu,
    AmountPipe,
    RatioPipe,
    TranslatePipe,
    MenuComponent,
    Button,
    TableModule
  ],
  templateUrl: './ticket-realized.component.html',
  styleUrl: './ticket-realized.component.scss'
})
export class TicketRealizedComponent implements OnInit {
  protected readonly store = inject(TicketStore);

  ngOnInit() {
    this.store.loadRealizedTicketList();
  }

  getExchangePdfDocument(id: number) {
    this.store.loadExchangePdfDocument(id);
  }

  getCurrency(ticket: UserTicket) {
    return CurrencyUtils.ticketToCurrency(ticket);
  }

  getDate(epochUtc: number) {
    return new Date(epochUtc * 1000).toISOString().substring(0, 19).replace('T', ' ');
  }
}
