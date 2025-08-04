import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {MessagesRoutingModule} from './messages-routing.module';
import {MessagesComponent} from "./messages.component";
import {TranslatePipe} from "@ngx-translate/core";


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    MessagesRoutingModule,
    MessagesComponent,
    TranslatePipe
  ]
})
export class MessagesModule {
}
