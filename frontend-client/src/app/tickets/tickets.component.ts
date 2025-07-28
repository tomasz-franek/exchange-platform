import { Component } from '@angular/core';
import { TicketMenu } from './ticket-menu/ticket-menu';

@Component({
  selector: 'app-tickets',
  templateUrl: './tickets.component.html',
  styleUrl: './tickets.component.css',
  imports: [TicketMenu],
})
export class TicketsComponent {}
