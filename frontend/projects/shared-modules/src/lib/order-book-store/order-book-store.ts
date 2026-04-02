import {OrderBookRow} from '../api/model/orderBookRow';
import {Pair} from '../api/model/pair';

import {patchState, signalStore, withComputed, withMethods, withState,} from '@ngrx/signals';
import {rxMethod} from '@ngrx/signals/rxjs-interop';
import {map, pipe, tap} from 'rxjs';
import {OrderBookData} from '../api/model/orderBookData';
import {computed} from '@angular/core';
import {
  removeEmptyRows,
  sortArrayAscending,
  sortArrayDescending,
  updateRowValue,
} from './order-book-functions';
import {PairUtils} from '../utils/pair-utils';

export const EMPTY_DATA = 0;
export const DIVIDER = 10000;

type OrderBookState = {
  lastFullOrderBook: OrderBookData[];
  pair: Pair | undefined;
  cumulativeBuyArray: OrderBookRow[];
  normalBuyArray: OrderBookRow[];
  cumulativeSellArray: OrderBookRow[];
  normalSellArray: OrderBookRow[];
  tableBuyArray: OrderBookRow[];
  tableSellArray: OrderBookRow[];
  yAxisValues: string[];
  cumulative: boolean;
  isLoading: boolean;
};

export const initialOrderBookState: OrderBookState = {
  lastFullOrderBook: [],
  pair: undefined,
  cumulativeSellArray: [],
  cumulativeBuyArray: [],
  normalBuyArray: [],
  normalSellArray: [],
  yAxisValues: [],
  tableBuyArray: [],
  tableSellArray: [],
  cumulative: false,
  isLoading: false,
};

export const OrderBookStore = signalStore(
  { providedIn: 'root' },
  withState(initialOrderBookState),
  withComputed(
    ({
      pair,
      normalBuyArray,
      normalSellArray,
      cumulativeSellArray,
      cumulativeBuyArray,
      cumulative,
    }) => ({
      buyCurrency: computed(() => {
        return PairUtils.getBaseCurrency(pair());
      }),
      sellCurrency: computed(() => {
        return PairUtils.getQuoteCurrency(pair());
      }),
      buyArray: computed(() => {
        if (cumulative()) {
          return cumulativeBuyArray();
        } else {
          return normalBuyArray();
        }
      }),
      sellArray: computed(() => {
        if (cumulative()) {
          return cumulativeSellArray();
        } else {
          return normalSellArray();
        }
      }),
    }),
  ),
  withMethods((store) => {
    function updateLastFullOrderBook(lastFullOrderBook: OrderBookData[]) {
      patchState(store, { lastFullOrderBook });
      const pair = store.pair();
      if (pair != undefined) {
        const orderBookData = lastFullOrderBook.find((e) => {
          return e.p == pair;
        });
        if (orderBookData != undefined) {
          doFullUpdate(orderBookData, pair);
        }
      }
    }
    function doFullUpdate(orderBookData: OrderBookData, pair: Pair) {
      const newBuyArray: OrderBookRow[] = sortArrayDescending(orderBookData.b);
      const newSellArray: OrderBookRow[] = sortArrayAscending(orderBookData.s);
      let cumulativeBuyArray: OrderBookRow[] = [];
      let normalBuyArray: OrderBookRow[] = [];
      const cumulativeSellArray: OrderBookRow[] = [];
      const normalSellArray: OrderBookRow[] = [];
      const yAxisValues: string[] = [];

      let cumulativeValueBuy = 0;
      let cumulativeValueSell = 0;

      newBuyArray.forEach((row) => {
        cumulativeValueBuy += row.a;
        cumulativeBuyArray.splice(0, 0, {
          ...row,
          a: cumulativeValueBuy,
        });
        normalBuyArray.push(row);
        cumulativeSellArray.push({
          r: row.r,
          a: EMPTY_DATA,
        });
        normalSellArray.push({ r: row.r, a: EMPTY_DATA });
        yAxisValues.push((row.r / DIVIDER).toFixed(4));
      });

      newSellArray.forEach((row) => {
        cumulativeBuyArray.push({
          r: row.r,
          a: EMPTY_DATA,
        });
        normalBuyArray.push({ r: row.r, a: EMPTY_DATA });
        cumulativeValueSell += row.a;
        cumulativeSellArray.splice(0, 0, { ...row, a: cumulativeValueSell });
        normalSellArray.splice(0, 0, row);
        yAxisValues.splice(0, 0, (row.r / DIVIDER).toFixed(4));
      });
      normalBuyArray = sortArrayDescending(normalBuyArray);
      let tableSellArray = Object.create(normalSellArray);
      let tableBuyArray = Object.create(normalBuyArray);
      tableSellArray = sortArrayAscending(tableSellArray);
      tableBuyArray = sortArrayDescending(tableBuyArray);
      cumulativeBuyArray = sortArrayDescending(cumulativeBuyArray);
      return patchState(store, {
        cumulativeBuyArray,
        cumulativeSellArray,
        normalBuyArray,
        normalSellArray,
        tableBuyArray,
        tableSellArray,
        yAxisValues,
        pair,
      });
    }
    function doPartialUpdate(orderBookData: OrderBookData) {
      // partial update
      orderBookData.b.forEach((buyRow: OrderBookRow) => {
        updateRowValue(store.buyArray(), buyRow);
      });
      orderBookData.s.forEach((sellRow: OrderBookRow) => {
        updateRowValue(store.sellArray(), sellRow);
      });
      let yAxisValues: string[] = [];
      let cumulativeValueBuy = 0;
      let cumulativeValueSell = 0;
      let cumulativeSellArray: OrderBookRow[] = [];
      let normalBuyArray: OrderBookRow[] = [];
      let cumulativeBuyArray: OrderBookRow[] = [];
      let normalSellArray: OrderBookRow[] = [];
      const newBuyArray: OrderBookRow[] = removeEmptyRows(store.buyArray());
      const sellArray: OrderBookRow[] = removeEmptyRows(store.sellArray());
      newBuyArray.forEach((row) => {
        cumulativeValueBuy += row.a;
        cumulativeBuyArray.splice(0, 0, {
          ...row,
          a: cumulativeValueBuy,
        });
        normalBuyArray.push(row);
        cumulativeSellArray.push({
          r: row.r,
          a: EMPTY_DATA,
        });
        normalSellArray.push({ r: row.r, a: EMPTY_DATA });
        yAxisValues.push((row.r / DIVIDER).toFixed(4));
      });

      sellArray.forEach((row) => {
        cumulativeBuyArray.push({
          r: row.r,
          a: EMPTY_DATA,
        });
        normalBuyArray.push({ r: row.r, a: EMPTY_DATA });
        cumulativeValueSell += row.a;
        cumulativeSellArray.push({ ...row, a: cumulativeValueSell });
        normalSellArray.push(row);
        yAxisValues.splice(0, 0, (row.r / DIVIDER).toFixed(4));
      });
      normalSellArray = sortArrayDescending(normalSellArray);
      cumulativeSellArray = sortArrayDescending(cumulativeSellArray);
      normalBuyArray = sortArrayDescending(normalBuyArray);
      cumulativeBuyArray = sortArrayDescending(cumulativeBuyArray);
      let tableSellArray = Object.create(normalSellArray);
      let tableBuyArray = Object.create(normalBuyArray);
      tableSellArray = sortArrayAscending(tableSellArray);
      tableBuyArray = sortArrayDescending(tableBuyArray);
      yAxisValues = yAxisValues.sort((a, b) => (a < b ? 1 : -1));
      return patchState(store, {
        cumulativeBuyArray,
        cumulativeSellArray,
        tableBuyArray,
        tableSellArray,
        normalBuyArray,
        normalSellArray,
        yAxisValues,
      });
    }
    const updateCumulative = rxMethod<boolean>(
      pipe(
        map((cumulative) => {
          patchState(store, { cumulative });
        }),
      ),
    );
    const updateData = rxMethod<OrderBookData[]>(
      pipe(
        tap(() => patchState(store, { isLoading: true })),
        map((orderBookDataArray) => {
          if (
            orderBookDataArray != undefined &&
            orderBookDataArray.length > 0
          ) {
            if (orderBookDataArray[0].f) {
              updateLastFullOrderBook(orderBookDataArray);
            } else {
              orderBookDataArray.forEach((row: OrderBookData) =>
                doPartialUpdate(row),
              );
            }
          }
        }),
        tap(() => patchState(store, { isLoading: false })),
      ),
    );
    const clearData = rxMethod<void>(
      pipe(tap(() => patchState(store, initialOrderBookState))),
    );
    const updatePair = rxMethod<Pair>(
      pipe(
        tap((pair) => {
          if (store.lastFullOrderBook()) {
            const array = store.lastFullOrderBook();
            const data = array.find((e) => e.p == pair);
            if (data) {
              doFullUpdate(data, pair);
            } else {
              patchState(store, {
                cumulativeBuyArray: [],
                normalBuyArray: [],
                cumulativeSellArray: [],
                normalSellArray: [],
                tableBuyArray: [],
                tableSellArray: [],
                yAxisValues: [],
                pair,
              });
            }
          }
        }),
      ),
    );
    return {
      updateData,
      clearData,
      updateCumulative,
      updatePair,
    };
  }),
);
