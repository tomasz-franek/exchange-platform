import { Component } from '@angular/core';
import { MenuComponent } from '../../menu/menu.component';
import { MessageMenu } from '../message-menu/message-menu';
import { MessageFilter } from '../message-filter/message-filter';
import { MessageList } from '../message-list/message-list';

@Component({
  selector: 'app-message-list-form',
  templateUrl: './message-list-form.html',
  styleUrl: './message-list-form.css',
  imports: [MenuComponent, MessageMenu, MessageFilter, MessageList],
})
export class MessageListForm {}
