import { OrderBookRow } from '../api/model/orderBookRow';
import { Pair } from '../api/model/pair';

import {
  patchState,
  signalStore,
  withComputed,
  withMethods,
  withState,
} from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { map, pipe, tap } from 'rxjs';
import { OrderBookData } from '../api/model/orderBookData';
import { computed } from '@angular/core';
import {
  removeEmptyRows,
  sortArrayAscending,
  sortArrayDescending,
  updateRowValue,
} from './order-book-functions';
import { PairUtils } from '../utils/pair-utils';

export const EMPTY_DATA = 0;
export const DIVIDER = 10000;

type OrderBookState = {
  pair: Pair | undefined;
  buyArray: OrderBookRow[];
  sellArray: OrderBookRow[];
  cumulativeBuyArray: OrderBookRow[];
  normalBuyArray: OrderBookRow[];
  cumulativeSellArray: OrderBookRow[];
  normalSellArray: OrderBookRow[];
  yAxisValues: string[];
  cumulative: boolean;
  isLoading: boolean;
};

export const initialOrderBookState: OrderBookState = {
  pair: undefined,
  buyArray: [],
  sellArray: [],
  cumulativeSellArray: [],
  cumulativeBuyArray: [],
  normalBuyArray: [],
  normalSellArray: [],
  yAxisValues: [],
  cumulative: false,
  isLoading: false,
};

export const OrderBookStore = signalStore(
  { providedIn: 'root' },
  withState(initialOrderBookState),
  withComputed(({ pair, normalBuyArray }) => ({
    buyCurrency: computed(() => {
      return PairUtils.getBaseCurrency(pair());
    }),
    sellCurrency: computed(() => {
      return PairUtils.getQuoteCurrency(pair());
    }),
  })),
  withMethods((store) => {
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
        cumulativeSellArray.push({ ...row, a: cumulativeValueSell });
        normalSellArray.push(row);
        yAxisValues.push((row.r / DIVIDER).toFixed(4));
      });
      const cumulative = store.cumulative();
      normalBuyArray = sortArrayDescending(normalBuyArray);
      cumulativeBuyArray = sortArrayDescending(cumulativeBuyArray);
      return patchState(store, {
        buyArray: cumulative ? cumulativeBuyArray : normalBuyArray,
        sellArray: cumulative ? cumulativeSellArray : normalSellArray,
        cumulativeBuyArray,
        cumulativeSellArray,
        normalBuyArray,
        normalSellArray,
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
        yAxisValues.push((row.r / DIVIDER).toFixed(4));
      });
      const cumulative = store.cumulative();
      normalSellArray = sortArrayAscending(normalSellArray);
      cumulativeSellArray = sortArrayAscending(cumulativeSellArray);
      normalBuyArray = sortArrayDescending(normalBuyArray);
      cumulativeBuyArray = sortArrayDescending(cumulativeBuyArray);
      return patchState(store, {
        buyArray: cumulative ? cumulativeBuyArray : normalBuyArray,
        sellArray: cumulative ? cumulativeSellArray : normalSellArray,
        cumulativeBuyArray,
        cumulativeSellArray,
        normalBuyArray,
        normalSellArray,
        yAxisValues,
      });
    }
    const updateCumulative = rxMethod<boolean>(
      pipe(
        map((cumulative) => {
          patchState(store, {
            cumulative,
            buyArray: cumulative
              ? store.cumulativeBuyArray()
              : store.normalBuyArray(),
            sellArray: cumulative
              ? store.cumulativeSellArray()
              : store.normalSellArray(),
          });
        }),
      ),
    );
    const updateData = rxMethod<{ orderBookData: OrderBookData; pair: Pair }>(
      pipe(
        tap(() => patchState(store, { isLoading: true })),
        map((data) => {
          if (data.orderBookData.f) {
            // full update
            doFullUpdate(data.orderBookData, data.pair);
          } else {
            doPartialUpdate(data.orderBookData);
          }
        }),
        tap(() => patchState(store, { isLoading: false })),
      ),
    );
    const clearData = rxMethod<void>(
      pipe(tap(() => patchState(store, initialOrderBookState))),
    );
    return {
      updateData,
      clearData,
      updateCumulative,
    };
  }),
);
