import { TestBed } from '@angular/core/testing';
import { WebsocketService } from './websocket.service';
import { OrderBookData } from '../../app/api/model/orderBookData';
import { Pair } from '../../app/api/model/pair';

describe('WebsocketService', () => {
  let service: WebsocketService;
  let mockWebSocket: jasmine.SpyObj<WebSocket>;

  beforeEach(() => {
    mockWebSocket = jasmine.createSpyObj('WebSocket', ['close']);
    spyOn(window, 'WebSocket').and.returnValue(mockWebSocket);

    TestBed.configureTestingModule({});
    service = TestBed.inject(WebsocketService);
  });

  afterEach(() => {
    mockWebSocket.close();
  });

  describe('initialization', () => {
    it('should be created', () => {
      expect(service).toBeTruthy();
    });

    it('should create a WebSocket connection to the correct URL', () => {
      expect(window.WebSocket).toHaveBeenCalledWith(
        'ws://localhost:8080/order-book',
      );
    });

    it('should set up message handler on initialization', () => {
      expect(mockWebSocket.onmessage).toBeDefined();
    });

    it('should set up error handler on initialization', () => {
      expect(mockWebSocket.onerror).toBeDefined();
    });

    it('should set up close handler on initialization', () => {
      expect(mockWebSocket.onclose).toBeDefined();
    });
  });

  describe('getMessages()', () => {
    it('should return an Observable', (done) => {
      const messages$ = service.getMessages();
      expect(messages$).toBeDefined();

      messages$.subscribe({
        complete: () => {
          expect(true).toBe(true);
          done();
        },
      });

      mockWebSocket.onclose!({} as any);
    });

    it('should emit parsed message data when WebSocket receives data', (done) => {
      const mockData: OrderBookData[] = [
        { p: Pair.EurUsd, f: true, s: [{ r: 1, a: 1 }], b: [{ r: 2, a: 2 }] },
        { p: Pair.EurGbp, f: true, s: [{ r: 3, a: 3 }], b: [{ r: 4, a: 4 }] },
      ];

      service.getMessages().subscribe((data) => {
        expect(data).toEqual(mockData);
        done();
      });

      const event = new MessageEvent('message', {
        data: JSON.stringify(mockData),
      });
      mockWebSocket.onmessage!(event as any);
    });

    it('should handle multiple incoming messages', (done) => {
      const messages: OrderBookData[][] = [];

      service.getMessages().subscribe((data) => {
        messages.push(data);
        if (messages.length === 2) {
          expect(messages[0]).toEqual([
            {
              p: Pair.EurUsd,
              f: true,
              s: [{ r: 1, a: 1 }],
              b: [{ r: 2, a: 2 }],
            },
          ]);
          expect(messages[1]).toEqual([
            {
              p: Pair.EurGbp,
              f: true,
              s: [{ r: 3, a: 3 }],
              b: [{ r: 4, a: 4 }],
            },
          ]);
          done();
        }
      });

      const event1 = new MessageEvent('message', {
        data: JSON.stringify([
          {
            p: Pair.EurUsd,
            f: true,
            s: [{ r: 1, a: 1 }],
            b: [{ r: 2, a: 2 }],
          },
        ]),
      });
      mockWebSocket.onmessage!(event1 as any);

      const event2 = new MessageEvent('message', {
        data: JSON.stringify([
          {
            p: Pair.EurGbp,
            f: true,
            s: [{ r: 3, a: 3 }],
            b: [{ r: 4, a: 4 }],
          },
        ]),
      });
      mockWebSocket.onmessage!(event2 as any);
    });

    it('should parse JSON data correctly from WebSocket events', (done) => {
      const complexData = [
        { p: Pair.EurUsd, f: true, s: [{ r: 1, a: 1 }], b: [{ r: 2, a: 2 }] },
        { p: Pair.EurGbp, f: true, s: [{ r: 3, a: 3 }], b: [{ r: 4, a: 4 }] },
      ];

      service.getMessages().subscribe((data) => {
        expect(data).toEqual(complexData);
        expect(data[0].p).toBe(Pair.EurUsd);
        done();
      });

      const event = new MessageEvent('message', {
        data: JSON.stringify(complexData),
      });
      mockWebSocket.onmessage!(event as any);
    });
  });

  describe('error handling', () => {
    it('should handle WebSocket errors gracefully', () => {
      spyOn(console, 'error');
      const mockError = new Event('error');

      mockWebSocket.onerror!(mockError as any);

      expect(console.error).toHaveBeenCalledWith('WebSocket error:', mockError);
    });

    it('should continue to accept messages after an error', (done) => {
      spyOn(console, 'error');

      service.getMessages().subscribe((data) => {
        expect(data).toEqual([
          { p: Pair.EurUsd, f: true, s: [{ r: 1, a: 1 }], b: [{ r: 2, a: 2 }] },
        ]);
        done();
      });

      const errorEvent = new Event('error');
      mockWebSocket.onerror!(errorEvent as any);

      const messageEvent = new MessageEvent('message', {
        data: JSON.stringify([
          { p: Pair.EurUsd, f: true, s: [{ r: 1, a: 1 }], b: [{ r: 2, a: 2 }] },
        ]),
      });
      mockWebSocket.onmessage!(messageEvent as any);
    });
  });

  describe('connection closure', () => {
    it('should handle WebSocket closure', (done) => {
      spyOn(console, 'log');

      service.getMessages().subscribe({
        complete: () => {
          expect(console.log).toHaveBeenCalledWith(
            'WebSocket connection closed',
          );
          done();
        },
      });

      mockWebSocket.onclose!({} as any);
    });

    it('should complete the observable when connection closes', (done) => {
      let completed = false;

      service.getMessages().subscribe({
        next: () => {},
        complete: () => {
          completed = true;
          expect(completed).toBe(true);
          done();
        },
      });

      mockWebSocket.onclose!({} as any);
    });

    it('should prevent new subscribers from receiving messages after closure', (done) => {
      mockWebSocket.onclose!({} as any);

      let receivedMessage = false;

      service.getMessages().subscribe({
        next: () => {
          receivedMessage = true;
        },
        complete: () => {
          expect(receivedMessage).toBe(false);
          done();
        },
      });
    });
  });

  describe('edge cases', () => {
    it('should handle empty array messages', (done) => {
      service.getMessages().subscribe((data) => {
        expect(data).toEqual([]);
        done();
      });

      const event = new MessageEvent('message', { data: '[]' });
      mockWebSocket.onmessage!(event as any);
    });

    it('should handle large message payloads', (done) => {
      const pairs = Object.entries(Pair).map(([_, value]) => ({ value }));
      const largeData = Array.from({ length: 20 }, (_, i) => [
        {
          p: pairs[i % pairs.length],
          f: true,
          s: [{ r: Math.random() * 1000, a: Math.random() * 1000 }],
          b: [{ r: Math.random() * 1000, a: Math.random() * 1000 }],
        },
      ]);

      service.getMessages().subscribe((data) => {
        expect(data.length).toBe(20);
        done();
      });

      const event = new MessageEvent('message', {
        data: JSON.stringify(largeData),
      });
      mockWebSocket.onmessage!(event as any);
    });
  });
});
