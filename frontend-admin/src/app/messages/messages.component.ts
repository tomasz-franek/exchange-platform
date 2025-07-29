import {Component} from '@angular/core';
import {MessageMenu} from "./message-menu/message-menu";

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrl: './messages.component.css',
  imports: [MessageMenu]
})
export class MessagesComponent {

}
