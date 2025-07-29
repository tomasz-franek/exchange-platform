import {Component} from '@angular/core';
import {TranslatePipe} from "@ngx-translate/core";
import {RouterLink} from "@angular/router";

@Component({
  selector: 'app-message-menu',
  templateUrl: './message-menu.html',
  imports: [
    TranslatePipe,
    RouterLink
  ],
  styleUrl: './message-menu.css'
})
export class MessageMenu {

}
