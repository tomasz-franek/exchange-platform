package org.exchange.utils;

import static org.assertj.core.api.Assertions.assertThat;
import static org.exchange.app.common.api.model.Direction.BUY;
import static org.exchange.app.common.api.model.Direction.SELL;

import org.exchange.app.common.api.model.Pair;
import org.junit.jupiter.api.Test;

class CurrencyUtilsTest {

  @Test
  public final void testSplitPair() {
    for (Pair object : Pair.values()) {
      assertThat(
          CurrencyUtils.pairToCurrency(object, SELL) + "_" + CurrencyUtils.pairToCurrency(
              object,
              BUY)).isEqualTo(object.toString());
    }
  }
}