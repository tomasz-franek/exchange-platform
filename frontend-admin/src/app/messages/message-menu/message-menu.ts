import { Component, Input } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-message-menu',
  templateUrl: './message-menu.html',
  imports: [TranslatePipe, RouterLink, FormsModule],
  styleUrl: './message-menu.css',
})
export class MessageMenu {
  @Input() checkedInput: string | undefined;
}
