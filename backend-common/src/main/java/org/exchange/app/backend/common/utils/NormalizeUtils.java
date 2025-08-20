package org.exchange.app.backend.common.utils;

import static org.exchange.app.backend.common.builders.CoreTicketProperties.DECIMAL_PLACES;
import static org.exchange.app.backend.common.builders.CoreTicketProperties.MAX_EXCHANGE_ERROR;
import static org.exchange.app.backend.common.builders.CoreTicketProperties.ONE_CENT_PLACES;

import java.math.BigDecimal;

public class NormalizeUtils {

  public static String normalizeValueToMoney(long value) {
    BigDecimal normalizedValue = BigDecimal.valueOf(value / MAX_EXCHANGE_ERROR);
    normalizedValue = normalizedValue.movePointLeft(ONE_CENT_PLACES);
    return normalizedValue.toString();
  }

  public static String normalizeValueToRatio(long value) {
    BigDecimal normalizedValue = BigDecimal.valueOf(value);
    normalizedValue = normalizedValue.movePointLeft(DECIMAL_PLACES);
    return normalizedValue.toString();
  }
}
