import {Component, inject, OnInit} from '@angular/core';
import {MenuComponent} from '../../menu/menu.component';
import {MessageMenuComponent} from '../message-menu/message-menu.component';
import {TranslatePipe} from '@ngx-translate/core';
import {TableModule} from 'primeng/table';
import {messageStore} from '../messages.signal-store';

@Component({
  selector: 'app-message-list',
  imports: [MenuComponent, MessageMenuComponent, TranslatePipe, TableModule],
  templateUrl: './message-list.html',
  styleUrl: './message-list.scss',
})
export class MessageList implements OnInit {
  protected readonly store = inject(messageStore);

  ngOnInit() {
    this.store.loadSystemMessageList();
  }
}
