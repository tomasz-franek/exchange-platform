import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MessagesRoutingModule } from './messages-routing.module';
import { MessagesComponent } from './messages.component';
import { TranslatePipe } from '@ngx-translate/core';
import { MessageFilter } from './message-filter/message-filter';
import { MessageList } from './message-list/message-list';
import { MessageListForm } from './message-list-form/message-list-form';

@NgModule({
  imports: [
    MessageFilter,
    MessageList,
    MessageListForm,
    CommonModule,
    MessagesRoutingModule,
    MessagesComponent,
    TranslatePipe,
  ],
})
export class MessagesModule {}
