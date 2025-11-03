import { UserTicket } from '../api/model/userTicket';
import { CurrencyUtils } from './currency-utils';
import { Pair } from '../api/model/pair';
import { Direction } from '../api/model/direction';

describe('CurrencyUtils', () => {
  describe('ticketToCurrency', () => {

    Object.values(Pair).forEach((pair) => {
      it(`should return the second currency for a BUY direction ${pair}`, () => {
        const ticket = { direction: Direction.Buy, pair } as UserTicket;
        const result = CurrencyUtils.ticketToCurrency(ticket);
        expect(result).toBe(pair.toString().substring(4, 7));
      });

      it(`should return the first currency for a SELL direction ${pair}`, () => {
        const ticket = { direction: Direction.Sell, pair } as UserTicket;
        const result = CurrencyUtils.ticketToCurrency(ticket);
        expect(result).toBe(pair.toString().substring(0, 3));
      });

    });
    it(`should return empty string when ticket is null`, () => {
      const result = CurrencyUtils.ticketToCurrency(null);
      expect(result).toBe('');
    });
  });

});
