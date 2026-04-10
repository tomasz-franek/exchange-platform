import {
  initialOrderBookState,
  OrderBookState,
  OrderBookStore,
} from './order-book-store';
import { TestBed } from '@angular/core/testing';
import { patchState } from '@ngrx/signals';
import { unprotected } from '@ngrx/signals/testing';
import { Pair } from '../../../../frontend-client/src/app/api/model/pair';
import { OrderBookData } from '../../../../frontend-client/src/app/api/model/orderBookData';

describe('OrderBookStore', () => {
  it('returns correct buyCurrency', () => {
    const orderBookStore = TestBed.inject(OrderBookStore);
    // when
    patchState(unprotected(orderBookStore), {
      pair: Pair.EurGbp,
      isLoading: false,
    });

    // then
    expect(orderBookStore.buyCurrency()).toEqual('EUR');
  });

  it('returns correct sellCurrency', () => {
    const orderBookStore = TestBed.inject(OrderBookStore);
    // when
    patchState(unprotected(orderBookStore), {
      pair: Pair.EurGbp,
      isLoading: false,
    });

    // then
    expect(orderBookStore.sellCurrency()).toEqual('GBP');
  });

  it('returns correct cumulative', () => {
    const orderBookStore = TestBed.inject(OrderBookStore);
    // when
    patchState(unprotected(orderBookStore), {
      cumulative: true,
      isLoading: false,
    });

    // then
    expect(orderBookStore.cumulative()).toEqual(true);

    // when
    patchState(unprotected(orderBookStore), {
      cumulative: false,
      isLoading: false,
    });

    // then
    expect(orderBookStore.cumulative()).toEqual(false);
  });

  describe('updateCumulative', () => {
    const initialStore = {
      cumulative: undefined,
      normalBuyArray: [{ r: 1, a: 1 }],
      cumulativeBuyArray: [{ r: 2, a: 2 }],
      normalSellArray: [{ r: 3, a: 3 }],
      cumulativeSellArray: [{ r: 4, a: 4 }],
      isLoading: false,
    };
    it('updateCumulative false should should set buyArray to normalBuyArray', () => {
      const orderBookStore = TestBed.inject(OrderBookStore);
      patchState(unprotected(orderBookStore), initialStore);

      // when
      orderBookStore.updateCumulative(false);

      // then
      expect(orderBookStore.buyArray()).toEqual([{ r: 1, a: 1 }]);
      expect(orderBookStore.cumulative()).toEqual(false);
    });

    it('updateCumulative false should should set sellArray to normalSellArray', () => {
      const orderBookStore = TestBed.inject(OrderBookStore);
      patchState(unprotected(orderBookStore), initialStore);

      // when
      orderBookStore.updateCumulative(false);

      // then
      expect(orderBookStore.sellArray()).toEqual([{ r: 3, a: 3 }]);
      expect(orderBookStore.cumulative()).toEqual(false);
    });

    it('updateCumulative true should should set buyArray to cumulativeBuyArray', () => {
      const orderBookStore = TestBed.inject(OrderBookStore);
      patchState(unprotected(orderBookStore), initialStore);

      // when
      orderBookStore.updateCumulative(true);

      // then
      expect(orderBookStore.buyArray()).toEqual([{ r: 2, a: 2 }]);
      expect(orderBookStore.cumulative()).toEqual(true);
    });

    it('updateCumulative true should should set sellArray to cumulativeSellArray', () => {
      const orderBookStore = TestBed.inject(OrderBookStore);
      patchState(unprotected(orderBookStore), initialStore);

      // when
      orderBookStore.updateCumulative(true);

      // then
      expect(orderBookStore.sellArray()).toEqual([{ r: 4, a: 4 }]);
      expect(orderBookStore.cumulative()).toEqual(true);
    });
  });

  describe('clearData', () => {
    it('clearData should set initialOrderBookState', () => {
      const orderBookStore = TestBed.inject(OrderBookStore);
      patchState(unprotected(orderBookStore), {
        pair: Pair.GbpChf,
        cumulativeSellArray: [{ r: 1, a: 2 }],
        cumulativeBuyArray: [{ r: 3, a: 4 }],
        normalBuyArray: [{ r: 5, a: 6 }],
        normalSellArray: [{ r: 7, a: 8 }],
        yAxisValues: ['a', 'b', 'c'],
        cumulative: true,
        isLoading: false,
      });

      orderBookStore.clearData();

      expect(orderBookStore.pair()).toEqual(initialOrderBookState.pair);
      expect(orderBookStore.buyArray()).toEqual([]);
      expect(orderBookStore.sellArray()).toEqual([]);
      expect(orderBookStore.cumulative()).toEqual(
        initialOrderBookState.cumulative,
      );
      expect(orderBookStore.yAxisValues()).toEqual(
        initialOrderBookState.yAxisValues,
      );
      expect(orderBookStore.normalSellArray()).toEqual(
        initialOrderBookState.normalSellArray,
      );
      expect(orderBookStore.normalBuyArray()).toEqual(
        initialOrderBookState.normalBuyArray,
      );
      expect(orderBookStore.cumulativeBuyArray()).toEqual(
        initialOrderBookState.cumulativeBuyArray,
      );
      expect(orderBookStore.cumulativeSellArray()).toEqual(
        initialOrderBookState.cumulativeSellArray,
      );
    });
  });

  describe('updateData', () => {
    it('when partial update then doPartialUpdate should be called', () => {
      const orderBookStore = TestBed.inject(OrderBookStore);
      const pair: Pair = Pair.GbpUsd;
      patchState(unprotected(orderBookStore), {
        pair: pair,
        normalBuyArray: [
          { r: 3, a: 3 },
          { r: 2, a: 2 },
          { r: 1, a: 1 },
        ],
        normalSellArray: [
          { r: 4, a: 4 },
          { r: 5, a: 5 },
          { r: 6, a: 6 },
        ],
        cumulativeSellArray: [],
        cumulativeBuyArray: [],
        yAxisValues: [],
      });
      const orderBookDataArray: OrderBookData[] = [
        {
          s: [
            { r: 4, a: -4 },
            { r: 5, a: 5 },
            { r: 6, a: 3 },
          ],
          b: [
            { r: 3, a: -3 },
            { r: 2, a: 2 },
            { r: 1, a: 4 },
          ],
          p: pair,
          f: false,
        },
      ];
      orderBookStore.updateData(orderBookDataArray);

      expect(orderBookStore.cumulativeSellArray()).toEqual([
        { r: 6, a: 19 },
        { r: 5, a: 10 },
        { r: 2, a: 0 },
        { r: 1, a: 0 },
      ]);
      expect(orderBookStore.cumulativeBuyArray()).toEqual([
        { r: 6, a: 0 },
        { r: 5, a: 0 },
        { r: 2, a: 4 },
        { r: 1, a: 9 },
      ]);
      expect(orderBookStore.normalBuyArray()).toEqual([
        { r: 6, a: 0 },
        { r: 5, a: 0 },
        { r: 2, a: 4 },
        { r: 1, a: 5 },
      ]);
      expect(orderBookStore.normalSellArray()).toEqual([
        { r: 6, a: 9 },
        { r: 5, a: 10 },
        { r: 2, a: 0 },
        { r: 1, a: 0 },
      ]);
      expect(orderBookStore.cumulative()).toBeFalse();
      expect(orderBookStore.buyArray()).toEqual([
        { r: 6, a: 0 },
        { r: 5, a: 0 },
        { r: 2, a: 4 },
        { r: 1, a: 5 },
      ]);
      expect(orderBookStore.sellArray()).toEqual([
        { r: 6, a: 9 },
        { r: 5, a: 10 },
        { r: 2, a: 0 },
        { r: 1, a: 0 },
      ]);
      expect(orderBookStore.yAxisValues()).toEqual([
        '0.0006',
        '0.0005',
        '0.0002',
        '0.0001',
      ]);
    });
    it('when full update then doFullUpdate should be called ', () => {
      const orderBookStore = TestBed.inject(OrderBookStore);
      const pair: Pair = Pair.GbpUsd;
      const orderBookDataArray: OrderBookData[] = [
        {
          s: [
            { r: 4, a: 4 },
            { r: 5, a: 5 },
            { r: 6, a: 6 },
          ],
          b: [
            { r: 3, a: 3 },
            { r: 2, a: 2 },
            { r: 1, a: 1 },
          ],
          p: pair,
          f: true,
        },
      ];
      patchState(unprotected(orderBookStore), initialOrderBookState);
      patchState(unprotected(orderBookStore), { pair: pair });
      expect(orderBookStore.yAxisValues()).toEqual([]);

      orderBookStore.updateData(orderBookDataArray);

      expect(orderBookStore.cumulativeSellArray()).toEqual([
        { r: 6, a: 15 },
        { r: 5, a: 9 },
        { r: 4, a: 4 },
        { r: 3, a: 0 },
        { r: 2, a: 0 },
        { r: 1, a: 0 },
      ]);
      expect(orderBookStore.cumulativeBuyArray()).toEqual([
        { r: 6, a: 0 },
        { r: 5, a: 0 },
        { r: 4, a: 0 },
        { r: 3, a: 3 },
        { r: 2, a: 5 },
        { r: 1, a: 6 },
      ]);
      expect(orderBookStore.normalBuyArray()).toEqual([
        { r: 6, a: 0 },
        { r: 5, a: 0 },
        { r: 4, a: 0 },
        { r: 3, a: 3 },
        { r: 2, a: 2 },
        { r: 1, a: 1 },
      ]);
      expect(orderBookStore.normalSellArray()).toEqual([
        { r: 6, a: 6 },
        { r: 5, a: 5 },
        { r: 4, a: 4 },
        { r: 3, a: 0 },
        { r: 2, a: 0 },
        { r: 1, a: 0 },
      ]);
      expect(orderBookStore.cumulative()).toBeFalse();
      expect(orderBookStore.buyArray()).toEqual([
        { r: 6, a: 0 },
        { r: 5, a: 0 },
        { r: 4, a: 0 },
        { r: 3, a: 3 },
        { r: 2, a: 2 },
        { r: 1, a: 1 },
      ]);
      expect(orderBookStore.sellArray()).toEqual([
        { r: 6, a: 6 },
        { r: 5, a: 5 },
        { r: 4, a: 4 },
        { r: 3, a: 0 },
        { r: 2, a: 0 },
        { r: 1, a: 0 },
      ]);
      expect(orderBookStore.yAxisValues()).toEqual([
        '0.0006',
        '0.0005',
        '0.0004',
        '0.0003',
        '0.0002',
        '0.0001',
      ]);
    });
  });
  describe('updatePair', function () {
    it('should clear store when is not specified pair in lastFullOrderBook', function () {
      const orderBookStore = TestBed.inject(OrderBookStore);
      const initialValues: OrderBookState = {
        lastFullOrderBook: [],
        pair: undefined,
        cumulativeSellArray: [{ r: 1, a: 1 }],
        cumulativeBuyArray: [{ r: 1, a: 1 }],
        normalBuyArray: [{ r: 1, a: 1 }],
        normalSellArray: [{ r: 1, a: 1 }],
        tableSellArray: [{ r: 1, a: 1 }],
        tableBuyArray: [{ r: 1, a: 1 }],
        yAxisValues: ['a', 'b'],
        cumulative: false,
        isLoading: false,
      };
      patchState(unprotected(orderBookStore), initialValues);
      orderBookStore.updatePair(Pair.EurChf);

      expect(orderBookStore.lastFullOrderBook()).toEqual([]);
      expect(orderBookStore.pair()).toEqual(Pair.EurChf);
      expect(orderBookStore.cumulativeSellArray()).toEqual([]);
      expect(orderBookStore.cumulativeBuyArray()).toEqual([]);
      expect(orderBookStore.normalBuyArray()).toEqual([]);
      expect(orderBookStore.normalSellArray()).toEqual([]);
      expect(orderBookStore.yAxisValues()).toEqual([]);
      expect(orderBookStore.cumulative()).toEqual(false);
    });

    it('should do full update store when is specified pair is in lastFullOrderBook', function () {
      const orderBookStore = TestBed.inject(OrderBookStore);
      const initialValues: OrderBookState = {
        lastFullOrderBook: [
          {
            p: Pair.EurUsd,
            f: true,
            b: [
              { r: 1, a: 1 },
              { r: 2, a: 2 },
            ],
            s: [
              { r: 3, a: 3 },
              { r: 4, a: 4 },
            ],
          },
        ],
        pair: undefined,
        cumulativeSellArray: [{ r: 1, a: 1 }],
        cumulativeBuyArray: [{ r: 1, a: 1 }],
        normalBuyArray: [{ r: 1, a: 1 }],
        normalSellArray: [{ r: 1, a: 1 }],
        tableBuyArray: [{ r: 1, a: 1 }],
        tableSellArray: [{ r: 1, a: 1 }],
        yAxisValues: ['a', 'b'],
        cumulative: false,
        isLoading: false,
      };
      patchState(unprotected(orderBookStore), initialValues);

      orderBookStore.updatePair(Pair.EurUsd);

      expect(orderBookStore.lastFullOrderBook()).toEqual([
        {
          p: Pair.EurUsd,
          f: true,
          b: [
            { r: 2, a: 2 },
            { r: 1, a: 1 },
          ],
          s: [
            { r: 3, a: 3 },
            { r: 4, a: 4 },
          ],
        },
      ]);
      expect(orderBookStore.pair()).toEqual(Pair.EurUsd);
      expect(orderBookStore.cumulativeSellArray()).toEqual([
        { r: 4, a: 7 },
        { r: 3, a: 3 },
        { r: 2, a: 0 },
        { r: 1, a: 0 },
      ]);
      expect(orderBookStore.cumulativeBuyArray()).toEqual([
        { r: 4, a: 0 },
        { r: 3, a: 0 },
        { r: 2, a: 2 },
        { r: 1, a: 3 },
      ]);
      expect(orderBookStore.normalBuyArray()).toEqual([
        { r: 4, a: 0 },
        { r: 3, a: 0 },
        { r: 2, a: 2 },
        { r: 1, a: 1 },
      ]);
      expect(orderBookStore.normalSellArray()).toEqual([
        { r: 4, a: 4 },
        { r: 3, a: 3 },
        { r: 2, a: 0 },
        { r: 1, a: 0 },
      ]);
      expect(orderBookStore.yAxisValues()).toEqual([
        '0.0004',
        '0.0003',
        '0.0002',
        '0.0001',
      ]);
      expect(orderBookStore.cumulative()).toEqual(false);
    });
  });
});
