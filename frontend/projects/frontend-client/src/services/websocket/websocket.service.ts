import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Observable } from 'rxjs/internal/Observable';
import { OrderBookData } from '../../app/api/model/orderBookData';

@Injectable({ providedIn: 'root' })
export class WebsocketService {
  private readonly websocket: WebSocket = new WebSocket(
    'ws://localhost:8080/order-book',
  );
  private readonly messages = new Subject<OrderBookData[]>();

  constructor() {
    this.connect();
  }

  getMessages(): Observable<OrderBookData[]> {
    return this.messages.asObservable();
  }

  private connect() {
    this.websocket.onmessage = (event) => {
      this.messages.next(JSON.parse(event.data));
    };

    this.websocket.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    this.websocket.onclose = () => {
      console.log('WebSocket connection closed');
      this.messages.complete();
    };
  }
}
