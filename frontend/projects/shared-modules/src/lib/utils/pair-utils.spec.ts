import { PairUtils } from './pair-utils';
import { Pair } from '../../../../frontend-client/src/app/api/model/pair';

describe('PairUtils', () => {
  const testData = [
    {
      pair: Pair.EurPln,
      base: 'EUR',
      quote: 'PLN',
    },
    {
      pair: Pair.UsdChf,
      base: 'USD',
      quote: 'CHF',
    },
    {
      pair: Pair.GbpChf,
      base: 'GBP',
      quote: 'CHF',
    },
  ];
  testData.forEach((data) => {
    it(`{$data.pair} should return Base Currency ${data.base}`, () => {
      expect(PairUtils.getBaseCurrency(data.pair)).toBe(data.base);
    });
    it(`{$data.pair} should return Quote Currency ${data.quote}`, () => {
      expect(PairUtils.getQuoteCurrency(data.pair)).toBe(data.quote);
    });
  });
  it(`getBaseCurrency should return empty string when ticket is null`, () => {
    const result = PairUtils.getBaseCurrency(undefined);
    expect(result).toBe('');
  });
  it(`getQuoteCurrency should return empty string when ticket is null`, () => {
    const result = PairUtils.getQuoteCurrency(undefined);
    expect(result).toBe('');
  });
});
