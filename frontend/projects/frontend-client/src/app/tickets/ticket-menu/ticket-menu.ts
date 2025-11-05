import {Component, inject, Input, OnInit} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {Menubar} from 'primeng/menubar';
import {MenuItem} from 'primeng/api';

@Component({
  selector: 'app-ticket-menu',
  imports: [ReactiveFormsModule, FormsModule, Menubar],
  templateUrl: './ticket-menu.html',
  styleUrl: './ticket-menu.css',
})
export class TicketMenu implements OnInit {
  @Input() checkedInput: string | undefined;
  protected readonly translateService: TranslateService = inject(TranslateService);
  protected items: MenuItem[] | undefined;

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
