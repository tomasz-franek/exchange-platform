import { Component, Input } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { RouterLink } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-ticket-menu',
  imports: [TranslatePipe, RouterLink, ReactiveFormsModule, FormsModule],
  templateUrl: './ticket-menu.html',
  styleUrl: './ticket-menu.css',
})
export class TicketMenu {
  @Input() checkedInput: string | undefined;
}
