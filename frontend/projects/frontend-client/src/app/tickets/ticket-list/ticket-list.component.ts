import {Component, inject, OnInit} from '@angular/core';
import {UserTicket} from '../../api/model/userTicket';
import {TranslatePipe} from '@ngx-translate/core';
import {RatioPipe} from '../../../pipes/ratio-pipe/ratio.pipe';
import {AmountPipe} from '../../../pipes/amount-pipe/amount.pipe';
import {TicketMenu} from '../ticket-menu/ticket-menu';
import {MenuComponent} from '../../menu/menu.component';
import {Button} from 'primeng/button';
import {TableModule} from 'primeng/table';
import {TicketStore} from '../tickets.signal-store';

@Component({
  selector: 'app-ticket-list',
  imports: [TranslatePipe, RatioPipe, AmountPipe, TicketMenu, MenuComponent, Button, TableModule],
  templateUrl: './ticket-list.component.html',
  styleUrl: './ticket-list.component.scss',
  standalone: true
})
export class TicketListComponent implements OnInit {
  protected readonly store = inject(TicketStore);

  ngOnInit(): void {
    this.store.loadUserTicketList();
  }

  cancelExchangeTicket(userTicket: UserTicket) {
    this.store.cancelExchangeTicket(userTicket);
  }
}
