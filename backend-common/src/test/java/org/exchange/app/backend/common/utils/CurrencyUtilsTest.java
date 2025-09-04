package org.exchange.app.backend.common.utils;

import static org.assertj.core.api.Assertions.assertThat;
import static org.exchange.app.backend.common.serializers.PairSerializer.NULL_BYTE;
import static org.exchange.app.common.api.model.Direction.BUY;
import static org.exchange.app.common.api.model.Direction.SELL;
import static org.junit.jupiter.api.Assertions.assertThrows;

import java.util.UUID;
import org.assertj.core.api.AssertionsForClassTypes;
import org.exchange.app.backend.common.builders.CoreTicketBuilder;
import org.exchange.app.common.api.model.Currency;
import org.exchange.app.common.api.model.Pair;
import org.exchange.app.common.api.model.UserTicket;
import org.exchange.app.common.api.model.UserTicketStatus;
import org.junit.jupiter.api.Test;

class CurrencyUtilsTest {

  @Test
  public void pairToCurrency_should_returnCorrectBuyAndSellCurrency_when_methodCalledWithPairAndDirection() {
    for (Pair object : Pair.values()) {
      assertThat(
          CurrencyUtils.pairToCurrency(object, SELL)
              + "_"
              + CurrencyUtils.pairToCurrency(object, BUY))
          .isEqualTo(object.toString());
    }
  }

  @Test
  public void pairToCurrency_should_returnCorrectBuyAndSellCurrency_when_methodIsCalledWithCoreTicket() {
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
  public void pairToCurrency_should_returnCorrectBuyAndSellCurrency_when_methodIsCalledWithUserTicket() {
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
  public void pairToCurrency_should_returnEmptyString_when_pairIsNull() {
    assertThat(CurrencyUtils.pairToCurrency(null, BUY)).isEqualTo("");
  }

  @Test
  public void pairToCurrency_should_returnEmptyString_when_directionIsNull() {
    assertThat(CurrencyUtils.pairToCurrency(Pair.USD_CHF, null)).isEqualTo("");
  }

  @Test
  public void pairReverseCurrencyString_should_returnEmptyString_when_pairIsNull() {
    assertThat(CurrencyUtils.pairReverseCurrencyString(null, BUY)).isEqualTo("");
  }

  @Test
  public void pairReverseCurrencyString_should_returnEmptyString_when_directionIsNull() {
    assertThat(CurrencyUtils.pairReverseCurrencyString(Pair.USD_CHF, null)).isEqualTo("");
  }

  @Test
  public void pairReverseCurrencyString_should_returnCorrectBuyAndSellCurrency_when_methodIsCalledWithPairAndDirection() {
    for (Pair object : Pair.values()) {
      assertThat(
          CurrencyUtils.pairReverseCurrencyString(object, BUY)
              + "_"
              + CurrencyUtils.pairReverseCurrencyString(object, SELL))
          .isEqualTo(object.toString());
    }
  }

  @Test
  public void pairReverseCurrencyString_should_returnCorrectBuyAndSellCurrency_when_methodIsCalledWithCoreTicket() {
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
  public void pairReverseCurrencyString_should_returnCorrectBuyAndSellCurrency_when_methodIsCalledWithUserTicket() {
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
  public void pairReverseCurrency_should_returnEmptyString_when_pairIsNull() {
    assertThat(CurrencyUtils.pairReverseCurrency(null, BUY)).isEqualTo(null);
  }

  @Test
  public void pairReverseCurrency_should_returnEmptyString_when_directionIsNull() {
    assertThat(CurrencyUtils.pairReverseCurrency(Pair.USD_CHF, null)).isEqualTo(null);
  }

  @Test
  public void pairReverseCurrency_should_returnCorrectBuyAndSellCurrency_when_methodIsCalled() {
    for (Pair object : Pair.values()) {
      assertThat(
          CurrencyUtils.pairReverseCurrency(object, BUY)
              + "_"
              + CurrencyUtils.pairReverseCurrency(object, SELL))
          .isEqualTo(object.toString());
    }
  }

  @Test
  public void toByteArray_should_returnCorrectObject_when_parameterIsCorrectByteArray() {
    CurrencyUtils currencyUtils = new CurrencyUtils();
    assertThat(currencyUtils.toByteArray(Currency.EUR,
        new ByteArrayData(CurrencyUtils.getSize()))).isEqualTo(new byte[]{0});
    assertThat(currencyUtils.toByteArray(Currency.PLN,
        new ByteArrayData(CurrencyUtils.getSize()))).isEqualTo(new byte[]{4});
    assertThat(currencyUtils.toByteArray(Currency.GBP,
        new ByteArrayData(CurrencyUtils.getSize()))).isEqualTo(new byte[]{2});
    assertThat(currencyUtils.toByteArray(Currency.USD,
        new ByteArrayData(CurrencyUtils.getSize()))).isEqualTo(new byte[]{1});
    assertThat(currencyUtils.toByteArray(Currency.CHF,
        new ByteArrayData(CurrencyUtils.getSize()))).isEqualTo(new byte[]{3});
  }

  @Test
  public final void toByteArray_should_returnNULL_BYTE_when_calledWithNullOrderBookRow() {
    CurrencyUtils currencyUtils = new CurrencyUtils();
    assertThat(currencyUtils.toByteArray(null, null)).isEqualTo(
        new byte[]{NULL_BYTE});
  }

  @Test
  public final void toObject_should_returnNullString_when_calledWithNULL_BYTE() {
    CurrencyUtils currencyUtils = new CurrencyUtils();
    Currency result = currencyUtils.toObject(new ByteArrayData(new byte[]{NULL_BYTE}));
    assertThat(result).isNull();
  }

  @Test
  public final void toObject_should_returnException_when_calledWithEmptyByteArray() {
    CurrencyUtils currencyUtils = new CurrencyUtils();
    RuntimeException runtimeException = assertThrows(RuntimeException.class,
        () -> currencyUtils.toObject(new ByteArrayData(new byte[]{}))
    );

    AssertionsForClassTypes.assertThat(runtimeException.getMessage())
        .isEqualTo("Byte array must be 1 or more bytes.");
  }

  @Test
  public final void toObject_should_returnCorrectCurrencyValue_when_calledWithFilledByteArray() {
    CurrencyUtils currencyUtils = new CurrencyUtils();
    for (int i = 0; i < Currency.values().length; i++) {
      assertThat(currencyUtils.toObject(new ByteArrayData(new byte[]{(byte) i}))).isEqualTo(
          Currency.values()[i]);
    }
  }
}