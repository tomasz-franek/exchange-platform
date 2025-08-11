import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MessagesRoutingModule } from './messages-routing-module';
import { MessageComponent } from './message.component';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    MessagesRoutingModule,
    MessageComponent
  ]
})
export class MessagesModule {
}
