package org.exchange.app.backend.common.builders;

import java.time.LocalDateTime;
import java.util.UUID;
import org.exchange.app.backend.common.exceptions.ExchangeException;
import org.exchange.app.common.api.model.Direction;
import org.exchange.app.common.api.model.Pair;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;

class ExchangeResultTest {

  private CoreTicket buyTicket;
  private CoreTicket sellTicket;
  private ExchangeResult exchangeResult;
  private LocalDateTime exchangeEpochUTC;

  @BeforeEach
  void setUp() {
    buyTicket = new CoreTicket(1L, 100, 300, UUID.randomUUID(), Pair.EUR_GBP, Direction.BUY);
    sellTicket = new CoreTicket(2L, 200, 300, UUID.randomUUID(), Pair.EUR_GBP, Direction.SELL);
    exchangeEpochUTC = LocalDateTime.now();
    exchangeResult = new ExchangeResult(buyTicket, sellTicket, exchangeEpochUTC, true);
  }

  @Test
  void testConstructorWithValidParams() {
    assertNotNull(exchangeResult, "ExchangeResult should be initialized properly.");
    assertEquals(buyTicket, exchangeResult.getBuyTicket(), "Buy ticket should match.");
    assertEquals(sellTicket, exchangeResult.getSellTicket(), "Sell ticket should match.");
  }

  @Test
  void validate_should_returnFalse_when_buyTicketNull() throws ExchangeException {
    exchangeResult = new ExchangeResult(buyTicket, sellTicket, exchangeEpochUTC, true);
    exchangeResult.setBuyTicket(null);
    exchangeResult.setSellTicket(new CoreTicket());
    exchangeResult.setSellExchange(new CoreTicket());
    exchangeResult.setBuyExchange(new CoreTicket());

    assertFalse(exchangeResult.validate());
  }

  @Test
  void validate_should_returnFalse_when_sellTicketNull() throws ExchangeException {
    exchangeResult = new ExchangeResult(buyTicket, sellTicket, exchangeEpochUTC, true);
    exchangeResult.setBuyTicket(new CoreTicket());
    exchangeResult.setSellTicket(null);
    exchangeResult.setSellExchange(new CoreTicket());
    exchangeResult.setBuyExchange(new CoreTicket());

    assertFalse(exchangeResult.validate());
  }

  @Test
  void validate_should_returnFalse_when_buyExchangeNull() throws ExchangeException {
    exchangeResult = new ExchangeResult(buyTicket, sellTicket, exchangeEpochUTC, true);
    exchangeResult.setBuyTicket(new CoreTicket());
    exchangeResult.setSellTicket(new CoreTicket());
    exchangeResult.setSellExchange(new CoreTicket());
    exchangeResult.setBuyExchange(null);

    assertFalse(exchangeResult.validate());
  }

  @Test
  void validate_should_returnFalse_when_sellExchangeNull() throws ExchangeException {
    exchangeResult = new ExchangeResult(buyTicket, sellTicket, exchangeEpochUTC, true);
    exchangeResult.setBuyTicket(new CoreTicket());
    exchangeResult.setSellTicket(new CoreTicket());
    exchangeResult.setSellExchange(null);
    exchangeResult.setBuyExchange(new CoreTicket());

    assertFalse(exchangeResult.validate());
  }

  @Test
  void validate_should_returnFalse_when_buyTicketDirectionSell() throws ExchangeException {
    exchangeResult = new ExchangeResult(buyTicket, sellTicket, exchangeEpochUTC, true);
    exchangeResult.setBuyTicket(
        new CoreTicket(1L, 200, 300, UUID.randomUUID(), Pair.EUR_GBP, Direction.SELL));
    exchangeResult.setSellTicket(new CoreTicket());
    exchangeResult.setSellExchange(new CoreTicket());
    exchangeResult.setBuyExchange(new CoreTicket());

    assertFalse(exchangeResult.validate());
  }

  @Test
  void validate_should_returnFalse_when_sellTicketDirectionBuy() throws ExchangeException {
    exchangeResult = new ExchangeResult(buyTicket, sellTicket, exchangeEpochUTC, true);
    exchangeResult.setBuyTicket(
        new CoreTicket(1L, 200, 300, UUID.randomUUID(), Pair.EUR_GBP, Direction.BUY));
    exchangeResult.setSellTicket(
        new CoreTicket(2L, 200, 300, UUID.randomUUID(), Pair.EUR_GBP, Direction.BUY));
    exchangeResult.setSellExchange(new CoreTicket());
    exchangeResult.setBuyExchange(new CoreTicket());

    assertFalse(exchangeResult.validate());
  }

  @Test
  void checkTicketAndTicketAfterExchange_should_throwException_when_incorrectBuyTicketAfterExchangeDirection()
      throws ExchangeException {
    exchangeResult = new ExchangeResult(buyTicket, sellTicket, exchangeEpochUTC, true);
    exchangeResult.setBuyTicket(
        new CoreTicket(1L, 200, 300, UUID.randomUUID(), Pair.EUR_GBP, Direction.BUY));
    exchangeResult.setSellTicket(
        new CoreTicket(2L, 200, 300, UUID.randomUUID(), Pair.EUR_GBP, Direction.SELL));
    exchangeResult.setSellExchange(new CoreTicket());
    exchangeResult.setBuyExchange(
        new CoreTicket(4L, 1200, 300, UUID.randomUUID(), Pair.EUR_GBP, Direction.SELL));
    exchangeResult.setBuyTicketAfterExchange(
        new CoreTicket(5L, 1200, 300, UUID.randomUUID(), Pair.EUR_GBP, Direction.SELL));

    ExchangeException exchangeException = assertThrows(ExchangeException.class,
        () -> exchangeResult.validate());
    assertThat(exchangeException.getMessage()).isEqualTo(
        "Invalid orderTicketAfterExchange direction : 'BUY' should be 'SELL'");
  }

  @Test
  void checkTicketAndTicketAfterExchange_should_throwException_when_incorrectSellTicketAfterExchangeDirection()
      throws ExchangeException {
    exchangeResult = new ExchangeResult(buyTicket, sellTicket, exchangeEpochUTC, true);
    exchangeResult.setBuyTicket(
        new CoreTicket(1L, 200, 300, UUID.randomUUID(), Pair.EUR_GBP, Direction.BUY));
    exchangeResult.setSellTicket(
        new CoreTicket(2L, 200, 300, UUID.randomUUID(), Pair.EUR_GBP, Direction.SELL));
    exchangeResult.setBuyExchange(new CoreTicket());
    exchangeResult.setSellExchange(
        new CoreTicket(4L, 1200, 300, UUID.randomUUID(), Pair.EUR_GBP, Direction.BUY));
    exchangeResult.setSellTicketAfterExchange(
        new CoreTicket(5L, 1200, 300, UUID.randomUUID(), Pair.EUR_GBP, Direction.BUY));

    ExchangeException exchangeException = assertThrows(ExchangeException.class,
        () -> exchangeResult.validate());
    assertThat(exchangeException.getMessage()).isEqualTo(
        "Invalid orderTicketAfterExchange direction : 'SELL' should be 'BUY'");
  }

  @Test
  void checkTicketAndTicketAfterExchange_should_notThrowException_when_CorrectExchangeData()
      throws ExchangeException {
    exchangeResult = new ExchangeResult(buyTicket, sellTicket, exchangeEpochUTC, true);
    exchangeResult.setBuyTicket(
        new CoreTicket(1L, 200, 300, UUID.randomUUID(), Pair.EUR_GBP, Direction.BUY));
    exchangeResult.setSellTicket(
        new CoreTicket(2L, 200, 300, UUID.randomUUID(), Pair.EUR_GBP, Direction.SELL));
    exchangeResult.setBuyExchange(
        new CoreTicket(2L, 200, 300, UUID.randomUUID(), Pair.EUR_GBP, Direction.SELL));
    exchangeResult.setBuyTicketAfterExchange(
        new CoreTicket(4L, 194, 300, UUID.randomUUID(), Pair.EUR_GBP, Direction.BUY));
    exchangeResult.setSellExchange(
        new CoreTicket(4L, 6, 300, UUID.randomUUID(), Pair.EUR_GBP, Direction.BUY));
    exchangeResult.setSellTicketAfterExchange(
        new CoreTicket(5L, 0, 300, UUID.randomUUID(), Pair.EUR_GBP, Direction.SELL));

    assertTrue(exchangeResult.validate());
  }

  @Test
  void checkTicketAndTicketAfterExchange_should_throwException_when_notEqualPairInTicketAndTicketAfterExchange() {
    CoreTicket ticket = new CoreTicket(1L, 200, 300, UUID.randomUUID(), Pair.EUR_USD,
        Direction.BUY);
    CoreTicket ticketAfterExchange = new CoreTicket(1L, 200, 300, UUID.randomUUID(), Pair.USD_CHF,
        Direction.BUY);
    ExchangeException exchangeException = assertThrows(ExchangeException.class,
        () -> exchangeResult.checkTicketAndTicketAfterExchange(ticket, ticketAfterExchange));
    assertThat(exchangeException.getMessage()).isEqualTo(
        "Invalid orderTicketAfterExchange currency : 'EUR_USD' should be 'USD_CHF'");
  }

  @Test
  void checkTicketAndTicketAfterExchange_should_throwException_when_notEqualRatioInTicketAndTicketAfterExchange() {
    CoreTicket ticket = new CoreTicket(1L, 200, 300, UUID.randomUUID(), Pair.EUR_USD,
        Direction.BUY);
    CoreTicket ticketAfterExchange = new CoreTicket(1L, 200, 400, UUID.randomUUID(), Pair.EUR_USD,
        Direction.BUY);
    ExchangeException exchangeException = assertThrows(ExchangeException.class,
        () -> exchangeResult.checkTicketAndTicketAfterExchange(ticket, ticketAfterExchange));
    assertThat(exchangeException.getMessage()).isEqualTo(
        "Invalid orderTicketAfterExchange exchange ratio : '300' should be '400'");
  }


  @Test
  void validateDirection_should_throwException_when_buyTicketAndSellExchangeTicketsHaveSameDirectionBuy() {
    exchangeResult = new ExchangeResult(buyTicket, sellTicket, true);
    exchangeResult.setBuyExchange(
        new CoreTicket(1L, 100, 300, UUID.randomUUID(), Pair.EUR_GBP, Direction.BUY));
    exchangeResult.setSellExchange(
        new CoreTicket(1L, 100, 300, UUID.randomUUID(), Pair.EUR_GBP, Direction.BUY));
    ExchangeException exchangeException = assertThrows(ExchangeException.class,
        () -> exchangeResult.validateDirection());
    assertThat(exchangeException.getMessage()).isEqualTo(
        "Not same direction for buy ticket : 'BUY' buy exchange: 'BUY'");
  }

  @Test
  void validateDirection_should_throwException_when_buyTicketAndSellExchangeTicketsHaveSameDirectionSell() {
    exchangeResult = new ExchangeResult(buyTicket, sellTicket, true);
    exchangeResult.setBuyExchange(
        new CoreTicket(1L, 100, 300, UUID.randomUUID(), Pair.EUR_GBP, Direction.SELL));
    exchangeResult.setSellExchange(
        new CoreTicket(1L, 100, 300, UUID.randomUUID(), Pair.EUR_GBP, Direction.SELL));
    ExchangeException exchangeException = assertThrows(ExchangeException.class,
        () -> exchangeResult.validateDirection());
    assertThat(exchangeException.getMessage()).isEqualTo(
        "Not same direction for sell ticket : 'SELL' sell exchange: 'SELL'");
  }

  @Test
  void validateDirection_should_throwException_when_buyTicketAndSellTicketsHaveSameDirection() {
    exchangeResult = new ExchangeResult(buyTicket, buyTicket, true);
    ExchangeException exchangeException = assertThrows(ExchangeException.class,
        () -> exchangeResult.validateDirection());
    assertThat(exchangeException.getMessage()).isEqualTo(
        "Not same direction for buy ticket : 'BUY' sell ticket : 'BUY'");
  }


  @Test
  void testFastValidateWithValidAmounts() throws ExchangeException {
    exchangeResult.setBuyExchange(
        new CoreTicket(1L, 100, 300, UUID.randomUUID(), Pair.EUR_GBP, Direction.BUY));
    exchangeResult.setSellExchange(
        new CoreTicket(1L, 100, 300, UUID.randomUUID(), Pair.EUR_GBP, Direction.SELL));
    assertTrue(exchangeResult.fastValidate(), "Fast validation should succeed with valid amounts.");
  }

  @Test
  void fastValidate_should_throwException_when_orderDifferenceGreaterThanMaxExchangeError() {
    exchangeResult.setBuyExchange(new CoreTicket(1L, 100, 300, UUID.randomUUID()));
    exchangeResult.setSellExchange(new CoreTicket(1L, 11100, 300, UUID.randomUUID()));

    ExchangeException exchangeException = assertThrows(ExchangeException.class,
        () -> exchangeResult.fastValidate());
    assertThat(exchangeException.getMessage()).isEqualTo(
        "Invalid validate transaction amount : 11097");
  }

  @Test
  void toString_should_returnCorrectString_when_calledWithBuyTicket() {

    exchangeResult.setBuyExchange(
        new CoreTicket(1L, 1000000, 30000, UUID.randomUUID(), Pair.CHF_PLN,
            Direction.BUY));
    exchangeResult.setSellTicket(
        new CoreTicket(1L, 300000, 30000, UUID.randomUUID(), Pair.CHF_PLN, Direction.SELL));
    exchangeResult.setCancelledTicket(
        new CoreTicket(1L, 1000000, 30000, UUID.randomUUID(), Pair.CHF_PLN,
            Direction.BUY));
    assertEquals(
        "EUR_GBP amount : '0.01' GBP ratio : '0.0300' -> 30.00 CHF\n buyTicket amount : '0.01' GBP ratio : '0.0300' sellTicket amount : '30.00' CHF ratio : '3.0000'",
        exchangeResult.toString());
  }

  @Test
  void validateValueAmount_should_returnException_whenWrongDifferenceBetweenBuyTicketAndTicketAfterExchange() {
    exchangeResult.setBuyExchange(
        new CoreTicket(1L, 11100, 300, UUID.randomUUID(), Pair.EUR_GBP, Direction.BUY));
    exchangeResult.setBuyTicketAfterExchange(
        new CoreTicket(1L, 11100, 300, UUID.randomUUID(), Pair.EUR_GBP, Direction.BUY));
    exchangeResult.setSellExchange(
        new CoreTicket(2L, 333, 300, UUID.randomUUID(), Pair.EUR_GBP, Direction.SELL));
    exchangeResult.setSellTicketAfterExchange(
        new CoreTicket(2L, 333, 300, UUID.randomUUID(), Pair.EUR_GBP, Direction.SELL));
    ExchangeException exchangeException = assertThrows(ExchangeException.class,
        () -> exchangeResult.validateValueAmount());
    assertThat(exchangeException.getMessage()).isEqualTo(
        "Invalid amount : buyTicket '100' + buyTicketAfterExchange: '11100' !=  sellExchange: '333'");
  }

  @Test
  void validateValueAmount_should_returnException_whenWrongDifferenceBetweenSellTicketAndTicketAfterExchange() {
    exchangeResult.setBuyExchange(
        new CoreTicket(1L, 11100, 300, UUID.randomUUID(), Pair.EUR_GBP, Direction.BUY));
    exchangeResult.setBuyTicketAfterExchange(
        new CoreTicket(1L, 0, 300, UUID.randomUUID(), Pair.EUR_GBP, Direction.BUY));
    exchangeResult.setSellExchange(
        new CoreTicket(2L, 100, 300, UUID.randomUUID(), Pair.EUR_GBP, Direction.SELL));
    exchangeResult.setSellTicketAfterExchange(
        new CoreTicket(2L, 0, 300, UUID.randomUUID(), Pair.EUR_GBP, Direction.SELL));
    ExchangeException exchangeException = assertThrows(ExchangeException.class,
        () -> exchangeResult.validateValueAmount());
    assertThat(exchangeException.getMessage()).isEqualTo(
        "Invalid amount : sellTicket '200' + sellTicketAfterExchange: '0' !=  buyExchange: '11100'");
  }

  @Test
  void toString_should_returnCorrectString_when_calledWithCancelledTicket() {

    exchangeResult.setBuyTicket(null);
    exchangeResult.setSellTicket(null);
    exchangeResult.setCancelledTicket(
        new CoreTicket(1L, 1000000, 30000, UUID.randomUUID(), Pair.CHF_PLN,
            Direction.BUY));
    assertEquals("Cancel ticket id=1", exchangeResult.toString());
  }

  @Test
  void toString_should_returnCorrectString_when_calledNoBuyTicketAndNoCancelledTicket() {

    exchangeResult.setBuyTicket(null);
    exchangeResult.setSellTicket(null);
    exchangeResult.setCancelledTicket(null);
    assertEquals("No info about ticket ", exchangeResult.toString());
  }
}
