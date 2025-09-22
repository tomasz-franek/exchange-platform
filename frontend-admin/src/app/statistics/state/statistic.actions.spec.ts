import { UsersStatisticRequest } from '../../api/model/usersStatisticRequest';
import {
  loadCurrencyStatisticAction,
  loadCurrencyStatisticFailure,
  loadCurrencyStatisticSuccess,
  loadPairStatisticAction,
  loadPairStatisticFailure,
  loadPairStatisticSuccess,
  loadUserStatisticAction,
  loadUserStatisticFailure,
  loadUserStatisticSuccess,
} from './statistic.actions';
import { HttpErrorResponse } from '@angular/common/http';
import { UsersStatisticResponse } from '../../api/model/usersStatisticResponse';
import { CurrencyStatisticResponse } from '../../api/model/currencyStatisticResponse';
import { Pair } from '../../api/model/pair';
import { PairStatisticResponse } from '../../api/model/pairStatisticResponse';

describe('Statistic Actions', () => {
  describe('loadUserStatisticAction', () => {
    it('should create an action to load user statistic', () => {
      const usersStatisticRequest: UsersStatisticRequest = {
        userId: '',
        currency: 'PLN',
      };
      const action = loadUserStatisticAction({ usersStatisticRequest });
      expect(action.type).toBe('[Statistic] Load User Statistic Action');
      expect(action.usersStatisticRequest).toEqual(usersStatisticRequest);
    });
    describe('loadUserStatisticSuccess', () => {
      it('should create an action for successful loading of user statistic operations', () => {
        const usersStatisticResponse: UsersStatisticResponse = {
          allTickets: 4,
          activeTickets: 43,
          amountInTickets: 41,
          amountTotal: 32,
        };
        const action = loadUserStatisticSuccess({
          usersStatisticResponse,
        });

        expect(action.type).toBe(
          '[Statistic] Load User Statistic Action Success',
        );
        expect(action.usersStatisticResponse).toEqual(usersStatisticResponse);
      });
    });

    describe('loadUserStatisticFailure', () => {
      it('should create an action for failed loading of user statistic operations', () => {
        const errorResponse = new HttpErrorResponse({
          error: 'Error message',
          status: 404,
        });
        const action = loadUserStatisticFailure({ errorResponse });

        expect(action.type).toBe(
          '[Statistic] Load User Statistic Action Failure',
        );
        expect(action.errorResponse).toEqual(errorResponse);
      });
    });
  });

  describe('loadCurrencyStatisticAction', () => {
    it('should create an action to load currency statistic', () => {
      const currency = 'USD';
      const action = loadCurrencyStatisticAction({ currency });
      expect(action.type).toBe('[Statistic] Load Currency Statistic Action');
      expect(action.currency).toEqual(currency);
    });
    describe('loadCurrencyStatisticSuccess', () => {
      it('should create an action for successful loading of currency statistic operations', () => {
        const currencyStatisticResponse: CurrencyStatisticResponse = {
          amountTotal: 452999,
          amountInTickets: 3,
          currency: 'USD',
        };
        const action = loadCurrencyStatisticSuccess({
          currencyStatisticResponse,
        });

        expect(action.type).toBe(
          '[Statistic] Load Currency Statistic Action Success',
        );
        expect(action.currencyStatisticResponse).toEqual(
          currencyStatisticResponse,
        );
      });
    });

    describe('loadCurrencyStatisticFailure', () => {
      it('should create an action for failed loading of currency statistic operations', () => {
        const errorResponse = new HttpErrorResponse({
          error: 'Error message',
          status: 404,
        });
        const action = loadCurrencyStatisticFailure({ errorResponse });

        expect(action.type).toBe(
          '[Statistic] Load Currency Statistic Action Failure',
        );
        expect(action.errorResponse).toEqual(errorResponse);
      });
    });
  });

  describe('loadPairStatisticAction', () => {
    it('should create an action to load pair statistic', () => {
      const pair = Pair.EurGbp;
      const action = loadPairStatisticAction({ pair });
      expect(action.type).toBe('[Statistic] Load Pair Statistic Action');
      expect(action.pair).toEqual(pair);
    });
    describe('loadPairStatisticSuccess', () => {
      it('should create an action for successful loading of pair statistic operations', () => {
        const pairStatisticResponse: PairStatisticResponse = {
          amountTicketsSell: 300,
          amountTicketsBuy: 5,
          countTicketsBuy: 43,
          countTicketsSell: 4,
        };
        const action = loadPairStatisticSuccess({
          pairStatisticResponse,
        });

        expect(action.type).toBe(
          '[Statistic] Load Pair Statistic Action Success',
        );
        expect(action.pairStatisticResponse).toEqual(pairStatisticResponse);
      });
    });

    describe('loadPairStatisticFailure', () => {
      it('should create an action for failed loading of pair statistic operations', () => {
        const errorResponse = new HttpErrorResponse({
          error: 'Error message',
          status: 404,
        });
        const action = loadPairStatisticFailure({ errorResponse });

        expect(action.type).toBe(
          '[Statistic] Load Pair Statistic Action Failure',
        );
        expect(action.errorResponse).toEqual(errorResponse);
      });
    });
  });
});
