import { Component, inject, Input, OnChanges } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { SystemMessage } from '../../api/model/systemMessage';
import { MessageState, selectSystemMessages } from '../state/message.selectors';
import { loadSystemMessageListAction } from '../state/message.actions';
import { Store } from '@ngrx/store';
import { MessageFilterParameters } from '../message-filter-parameters';

@Component({
  selector: 'app-message-list',
  templateUrl: './message-list.html',
  styleUrl: './message-list.css',
  imports: [TranslatePipe],
})
export class MessageList implements OnChanges {
  @Input() searchParams: MessageFilterParameters | undefined = undefined;
  protected _messages$: SystemMessage[] = [];
  private readonly _storeMessages$: Store<MessageState> = inject(Store);

  ngOnChanges() {
    this._storeMessages$.select(selectSystemMessages).subscribe((messages) => {
      this._messages$ = messages;
    });
    this._storeMessages$.dispatch(loadSystemMessageListAction());
  }
}
