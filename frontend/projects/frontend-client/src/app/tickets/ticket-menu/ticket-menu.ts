import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Menubar } from 'primeng/menubar';
import { BaseMenuComponent } from '../../base-menu-component/base-menu-component';

@Component({
  selector: 'app-ticket-menu',
  imports: [ReactiveFormsModule, FormsModule, Menubar],
  templateUrl: './ticket-menu.html',
  styleUrl: './ticket-menu.scss',
})
export class TicketMenu extends BaseMenuComponent {
  override ngOnInit() {
    this.items = [
      {
        label: this.translateService.instant('MENU.TICKETS.TICKET_LIST'),
        routerLink: '/tickets/ticket-list',
        id: 'ticketList',
      },
      {
        label: this.translateService.instant('MENU.TICKETS.ADD_TICKET'),
        routerLink: '/tickets/ticket-order',
        id: 'addTicket',
      },
      {
        label: this.translateService.instant('MENU.TICKETS.TICKETS_REALIZED'),
        routerLink: '/tickets/ticket-realized',
        id: 'realizedList',
      },
    ];
  }
}
