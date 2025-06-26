package org.exchange.app.backend.common.utils;

import static org.assertj.core.api.Assertions.assertThat;
import static org.exchange.app.common.api.model.Direction.BUY;
import static org.exchange.app.common.api.model.Direction.SELL;

import org.exchange.app.common.api.model.Pair;
import org.junit.jupiter.api.Test;

class CurrencyUtilsTest {

  @Test
  public final void pairToCurrency_should_returnCorrectBuyAndSellCurrency_when_methodIsCalled() {
    for (Pair object : Pair.values()) {
      assertThat(
          CurrencyUtils.pairToCurrency(object, SELL)
              + "_"
              + CurrencyUtils.pairToCurrency(object, BUY))
          .isEqualTo(object.toString());
    }
  }

  @Test
  public final void pairToCurrency_should_returnEmptyString_when_pairIsNull() {
    assertThat(CurrencyUtils.pairToCurrency(null, BUY)).isEqualTo("");
  }

  @Test
  public final void pairToCurrency_should_returnEmptyString_when_directionIsNull() {
    assertThat(CurrencyUtils.pairToCurrency(Pair.USD_CHF, null)).isEqualTo("");
  }

  @Test
  public final void pairReverseCurrency_should_returnEmptyString_when_pairIsNull() {
    assertThat(CurrencyUtils.pairReverseCurrency(null, BUY)).isEqualTo("");
  }

  @Test
  public final void pairReverseCurrency_should_returnEmptyString_when_directionIsNull() {
    assertThat(CurrencyUtils.pairReverseCurrency(Pair.USD_CHF, null)).isEqualTo("");
  }

  @Test
  public final void pairReverseCurrency_should_returnCorrectBuyAndSellCurrency_when_methodIsCalled() {
    for (Pair object : Pair.values()) {
      assertThat(
          CurrencyUtils.pairReverseCurrency(object, BUY)
              + "_"
              + CurrencyUtils.pairReverseCurrency(object, SELL))
          .isEqualTo(object.toString());
    }
  }
}