import {Component, inject, Input, OnChanges} from '@angular/core';
import {TranslatePipe} from '@ngx-translate/core';
import {MessageFilterParameters} from '../message-filter-parameters';
import {TableModule} from 'primeng/table';
import {MessageStore} from '../messages.signal-store';

@Component({
  selector: 'app-message-list',
  templateUrl: './message-list.html',
  styleUrl: './message-list.scss',
  imports: [TranslatePipe, TableModule],
})
export class MessageList implements OnChanges {
  @Input() searchParams: MessageFilterParameters | undefined = undefined;
  protected readonly store = inject(MessageStore);

  ngOnChanges() {
    this.store.loadSystemMessageList();
  }
}
