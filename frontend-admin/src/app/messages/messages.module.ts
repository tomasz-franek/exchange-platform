import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {MessagesRoutingModule} from './messages-routing.module';
import {MessagesComponent} from './messages.component';
import {TranslatePipe} from '@ngx-translate/core';
import {MessageFilter} from './message-filter/message-filter';
import {MessageList} from './message-list/message-list';
import {MessageListForm} from './message-list-form/message-list-form';
import {MessageAdd} from './message-add/message-add';
import {MenuComponent} from '../menu/menu.component';
import {MessageMenu} from './message-menu/message-menu';

@NgModule({
  imports: [
    MessageFilter,
    MessageList,
    MessageListForm,
    MessageAdd,
    MenuComponent,
    CommonModule,
    MessagesRoutingModule,
    MessagesComponent,
    TranslatePipe,
    MessageMenu
  ],
})
export class MessagesModule {
}
