package org.exchange.app.backend.common.utils;

import static org.exchange.app.common.api.model.Direction.BUY;

import org.exchange.app.common.api.model.Direction;
import org.exchange.app.common.api.model.Pair;

public class CurrencyUtils {

  public static String pairToCurrency(final Pair currencyChange, final Direction direction) {
    if (BUY.equals(direction)) {
      return currencyChange.name().split("_")[1];
    } else {
      return currencyChange.name().split("_")[0];
    }
  }

  public static String pairReverseCurrency(final Pair currencyChange, final Direction direction) {
    if (BUY.equals(direction)) {
      return currencyChange.name().split("_")[0];
    } else {
      return currencyChange.name().split("_")[1];
    }
  }

}
