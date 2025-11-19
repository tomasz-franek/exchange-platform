import {Component, inject, Input, OnChanges} from '@angular/core';
import {TranslatePipe} from '@ngx-translate/core';
import {SystemMessage} from '../../api/model/systemMessage';
import {MessageState, selectSystemMessages} from '../state/message.selectors';
import {loadSystemMessageListAction} from '../state/message.actions';
import {Store} from '@ngrx/store';
import {MessageFilterParameters} from '../message-filter-parameters';
import {TableModule} from 'primeng/table';
import {monitoringStore} from '../../monitoring/monitoring.signal-store';
import {messageStore} from '../messages.signal-store';

@Component({
  selector: 'app-message-list',
  templateUrl: './message-list.html',
  styleUrl: './message-list.scss',
  imports: [TranslatePipe, TableModule],
})
export class MessageList implements OnChanges {
  @Input() searchParams: MessageFilterParameters | undefined = undefined;
  protected readonly store = inject(messageStore);

  ngOnChanges() {
    this.store.loadSystemMessageList();
  }
}
