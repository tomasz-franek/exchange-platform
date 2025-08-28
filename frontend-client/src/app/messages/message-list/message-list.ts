import { Component, inject, OnInit } from '@angular/core';
import { MenuComponent } from '../../menu/menu.component';
import { MessageMenuComponent } from '../message-menu/message-menu.component';
import { Store } from '@ngrx/store';
import {
  MessageState,
  selectSystemMessageList,
} from '../state/message.selectors';
import { SystemMessage } from '../../api/model/systemMessage';
import { loadMessageListAction } from '../state/message.actions';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-message-list',
  imports: [MenuComponent, MessageMenuComponent, TranslatePipe],
  templateUrl: './message-list.html',
  styleUrl: './message-list.css',
})
export class MessageList implements OnInit {
  private readonly _storeMessage$: Store<MessageState> = inject(Store);
  protected _messages$: SystemMessage[] = [];

  ngOnInit() {
    this._storeMessage$.select(selectSystemMessageList).subscribe((data) => {
      this._messages$ = data;
    });
    this._storeMessage$.dispatch(loadMessageListAction());
  }
}
