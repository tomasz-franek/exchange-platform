import {Component, OnInit} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {Menubar} from 'primeng/menubar';
import {CheckedMenu} from '../../../../../shared-modules/src/lib/checked-menu/checked-menu';

@Component({
  selector: 'app-ticket-menu',
  imports: [ReactiveFormsModule, FormsModule, Menubar],
  templateUrl: './ticket-menu.html',
  styleUrl: './ticket-menu.css',
})
export class TicketMenu extends CheckedMenu implements OnInit {


  ngOnInit() {
    this.items = [
      {
        label: this.translateService.instant('MENU.TICKETS.TICKET_LIST'),
        routerLink: '/tickets/ticket-list',
        id: 'ticketList'
      },
      {
        label: this.translateService.instant('MENU.TICKETS.ADD_TICKET'),
        routerLink: '/tickets/ticket-order',
        id: 'addTicket'
      },
      {
        label: this.translateService.instant('MENU.TICKETS.TICKETS_REALIZED'),
        routerLink: '/tickets/ticket-realized',
        id: 'realizedList'
      }
    ];
  }
}
