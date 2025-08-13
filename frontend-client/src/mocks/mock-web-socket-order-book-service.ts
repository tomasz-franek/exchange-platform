import { Observable, of } from 'rxjs';

export class MockWebSocketOrderBookService {
  public getMessages(): Observable<any> {
    return of([]);
  }
}
