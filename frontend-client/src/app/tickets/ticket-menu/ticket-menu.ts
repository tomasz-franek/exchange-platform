import { Component } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-ticket-menu',
  imports: [TranslatePipe, RouterLink],
  templateUrl: './ticket-menu.html',
  styleUrl: './ticket-menu.css',
})
export class TicketMenu {}
