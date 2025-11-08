import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MessagesRoutingModule } from './messages-routing-module';
import { MessageComponent } from './message.component';
import { MessageList } from './message-list/message-list';

@NgModule({
  declarations: [],
  imports: [CommonModule, MessagesRoutingModule, MessageComponent, MessageList],
})
export class MessagesModule {}
