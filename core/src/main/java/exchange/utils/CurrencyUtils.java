package exchange.utils;

import static exchange.app.api.model.Direction.BUY;

import exchange.app.api.model.Direction;
import exchange.app.api.model.Pair;

public class CurrencyUtils {

  public static String pairToCurrency(final Pair currencyChange, final Direction direction) {
    if (BUY.equals(direction)) {
      return currencyChange.name().split("_")[1];
    } else {
      return currencyChange.name().split("_")[0];
    }
  }
}
