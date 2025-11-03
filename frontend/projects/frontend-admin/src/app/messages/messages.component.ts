import {Component} from '@angular/core';
import {MessageMenu} from "./message-menu/message-menu";
import {MenuComponent} from '../menu/menu.component';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrl: './messages.component.css',
  imports: [MessageMenu, MenuComponent]
})
export class MessagesComponent {

}
