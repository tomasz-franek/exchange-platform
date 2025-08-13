import { Observable, of } from 'rxjs';

export const mockWebsocketService = {
  connect() {
  },
  getMessages(): Observable<any> {
    return of({});
  }
};
