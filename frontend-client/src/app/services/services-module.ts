import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WebsocketOrderBookService } from './websocket.orderbook.service';
import { ApiService } from './api.service';

@NgModule({
  declarations: [],
  imports: [CommonModule],
  exports: [ApiService, WebsocketOrderBookService],
})
export class ServicesModule {}
