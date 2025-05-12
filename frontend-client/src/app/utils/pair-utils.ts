import { Pair } from '../api/model/pair';

export class PairUtils {
  public static getBaseCurrency(pair: Pair): string {
    return pair.toString().substring(0, 3);
  }

  public static getQuoteCurrency(pair: Pair): string {
    return pair.toString().substring(4, 7);
  }
}
