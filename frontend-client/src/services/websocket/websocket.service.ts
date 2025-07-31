import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Observable } from 'rxjs/internal/Observable';

@Injectable()
export class WebsocketService {
  private websocket: WebSocket = new WebSocket(
    'ws://localhost:8080/order-book',
  );
  private messages: Subject<any> = new Subject();

  constructor() {
    this.connect();
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

  getMessages(): Observable<any> {
    return this.messages.asObservable();
  }
}
