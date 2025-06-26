package org.exchange.app.backend.common.utils;

import static org.exchange.app.common.api.model.Direction.BUY;

import jakarta.validation.constraints.NotNull;
import org.exchange.app.common.api.model.Direction;
import org.exchange.app.common.api.model.Pair;

public class CurrencyUtils {

  public static String pairToCurrency(final @NotNull Pair currencyChange,
      final @NotNull Direction direction) {
    if (currencyChange == null || direction == null) {
      return "";
    }
    if (BUY.equals(direction)) {
      return currencyChange.name().split("_")[1];
    } else {
      return currencyChange.name().split("_")[0];
    }
  }

  public static String pairReverseCurrency(final @NotNull Pair currencyChange,
      final @NotNull Direction direction) {
    if (currencyChange == null || direction == null) {
      return "";
    }
    if (BUY.equals(direction)) {
      return currencyChange.name().split("_")[0];
    } else {
      return currencyChange.name().split("_")[1];
    }
  }

}
