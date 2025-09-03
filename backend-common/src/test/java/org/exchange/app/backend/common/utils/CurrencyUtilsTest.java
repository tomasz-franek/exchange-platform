package org.exchange.app.backend.common.utils;

import static org.assertj.core.api.Assertions.assertThat;
import static org.exchange.app.common.api.model.Direction.BUY;
import static org.exchange.app.common.api.model.Direction.SELL;

import java.util.UUID;
import org.exchange.app.backend.common.builders.CoreTicketBuilder;
import org.exchange.app.common.api.model.Pair;
import org.exchange.app.common.api.model.UserTicket;
import org.exchange.app.common.api.model.UserTicketStatus;
import org.junit.jupiter.api.Test;

class CurrencyUtilsTest {

  @Test
  public final void pairToCurrency_should_returnCorrectBuyAndSellCurrency_when_methodCalledWithPairAndDirection() {
    for (Pair object : Pair.values()) {
      assertThat(
          CurrencyUtils.pairToCurrency(object, SELL)
              + "_"
              + CurrencyUtils.pairToCurrency(object, BUY))
          .isEqualTo(object.toString());
    }
  }

  @Test
  public final void pairToCurrency_should_returnCorrectBuyAndSellCurrency_when_methodIsCalledWithCoreTicket() {
    for (Pair object : Pair.values()) {
      assertThat(
          CurrencyUtils.pairToCurrency(
              CoreTicketBuilder.createBuilder().withPair(object).withDirection(SELL).withId(1L)
                  .withUserId(UUID.randomUUID()).withAmount(100L).withRatio(100).build())
              + "_"
              + CurrencyUtils.pairToCurrency(
              CoreTicketBuilder.createBuilder().withPair(object).withDirection(BUY).withId(1L)
                  .withUserId(UUID.randomUUID()).withAmount(100L).withRatio(100).build()))
          .isEqualTo(object.toString());
    }
  }

  @Test
  public final void pairToCurrency_should_returnCorrectBuyAndSellCurrency_when_methodIsCalledWithUserTicket() {
    for (Pair object : Pair.values()) {
      assertThat(
          CurrencyUtils.pairToCurrency(
              new UserTicket(1L, 1L, 1L, object, 1L, SELL, UserTicketStatus.NEW, 1))
              + "_"
              + CurrencyUtils.pairToCurrency(
              new UserTicket(1L, 1L, 1L, object, 1L, BUY, UserTicketStatus.NEW, 1)))
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
  public final void pairReverseCurrencyString_should_returnEmptyString_when_pairIsNull() {
    assertThat(CurrencyUtils.pairReverseCurrencyString(null, BUY)).isEqualTo("");
  }

  @Test
  public final void pairReverseCurrencyString_should_returnEmptyString_when_directionIsNull() {
    assertThat(CurrencyUtils.pairReverseCurrencyString(Pair.USD_CHF, null)).isEqualTo("");
  }

  @Test
  public final void pairReverseCurrencyString_should_returnCorrectBuyAndSellCurrency_when_methodIsCalledWithPairAndDirection() {
    for (Pair object : Pair.values()) {
      assertThat(
          CurrencyUtils.pairReverseCurrencyString(object, BUY)
              + "_"
              + CurrencyUtils.pairReverseCurrencyString(object, SELL))
          .isEqualTo(object.toString());
    }
  }

  @Test
  public final void pairReverseCurrencyString_should_returnCorrectBuyAndSellCurrency_when_methodIsCalledWithCoreTicket() {
    for (Pair object : Pair.values()) {
      assertThat(
          CurrencyUtils.pairReverseCurrencyString(
              CoreTicketBuilder.createBuilder().withPair(object).withDirection(BUY).withId(1L)
                  .withUserId(UUID.randomUUID()).withAmount(100L).withRatio(100).build())
              + "_"
              + CurrencyUtils.pairReverseCurrencyString(
              CoreTicketBuilder.createBuilder().withPair(object).withDirection(SELL).withId(1L)
                  .withUserId(UUID.randomUUID()).withAmount(100L).withRatio(100).build()))
          .isEqualTo(object.toString());
    }
  }

  @Test
  public final void pairReverseCurrencyString_should_returnCorrectBuyAndSellCurrency_when_methodIsCalledWithUserTicket() {
    for (Pair object : Pair.values()) {
      assertThat(
          CurrencyUtils.pairReverseCurrencyString(
              new UserTicket(1L, 1L, 1L, object, 1L, BUY, UserTicketStatus.NEW, 1))
              + "_"
              + CurrencyUtils.pairReverseCurrencyString(
              new UserTicket(1L, 1L, 1L, object, 1L, SELL, UserTicketStatus.NEW, 1)))
          .isEqualTo(object.toString());
    }
  }

	@Test
	public final void pairReverseCurrency_should_returnEmptyString_when_pairIsNull() {
		assertThat(CurrencyUtils.pairReverseCurrency(null, BUY)).isEqualTo(null);
	}

	@Test
	public final void pairReverseCurrency_should_returnEmptyString_when_directionIsNull() {
		assertThat(CurrencyUtils.pairReverseCurrency(Pair.USD_CHF, null)).isEqualTo(null);
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