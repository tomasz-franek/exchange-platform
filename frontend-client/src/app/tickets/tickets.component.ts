import { Component } from '@angular/core';
import { TicketMenu } from './ticket-menu/ticket-menu';
import { MenuComponent } from '../menu/menu.component';

@Component({
  selector: 'app-tickets',
  templateUrl: './tickets.component.html',
  styleUrl: './tickets.component.css',
  imports: [TicketMenu, MenuComponent]
})
export class TicketsComponent {
}
