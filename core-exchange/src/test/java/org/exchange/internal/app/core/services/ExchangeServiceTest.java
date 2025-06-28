package org.exchange.internal.app.core.services;

import static org.assertj.core.api.AssertionsForClassTypes.assertThat;
import static org.exchange.app.common.api.model.Direction.BUY;
import static org.exchange.app.common.api.model.Direction.SELL;
import static org.exchange.app.common.api.model.Pair.EUR_PLN;
import static org.junit.jupiter.api.Assertions.fail;

import java.util.UUID;
import org.exchange.app.backend.common.exceptions.ExchangeException;
import org.exchange.app.common.api.model.Pair;
import org.exchange.internal.app.core.builders.CoreTicket;
import org.exchange.internal.app.core.builders.CoreTicketBuilder;
import org.exchange.internal.app.core.data.ExchangeResult;
import org.exchange.internal.app.core.strategies.ratio.FirstTicketRatioStrategy;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;

class ExchangeServiceTest {

  private static void checkResultValues(ExchangeResult result) throws ExchangeException {
    if (result == null) {
      fail("Result is null");
    }
    assertThat(result.validate()).isEqualTo(true);
    assertThat(result.getSellTicket().getAmount()).isEqualTo(
        result.getSellTicketAfterExchange().getAmount()
            + result.getBuyExchange().getAmount());
    assertThat(result.getBuyTicket().getAmount()).isEqualTo(
        result.getBuyTicketAfterExchange().getAmount()
            + result.getSellExchange().getAmount());
    assertThat(result.getBuyTicket().getIdCurrency()).isEqualTo(
        result.getSellExchange().getIdCurrency());
    assertThat(result.getSellTicket().getIdCurrency()).isEqualTo(
        result.getBuyExchange().getIdCurrency());
    assertThat(result.getSellExchange().getDirection()).isEqualTo(BUY);
    assertThat(result.getBuyExchange().getDirection()).isEqualTo(SELL);
    assertThat(result.getBuyTicketAfterExchange().getDirection()).isEqualTo(BUY);
    assertThat(result.getSellTicketAfterExchange().getDirection()).isEqualTo(SELL);
  }

  @Test
  public final void testForexExchange1() throws ExchangeException {
    ExchangeService exchangeService = new ExchangeService(EUR_PLN, new FirstTicketRatioStrategy());
    exchangeService.addCoreTicket(
        CoreTicketBuilder.createBuilder()
            .withId(1L)
            .withUserId(UUID.randomUUID())
            .withPair(EUR_PLN)
            .withDirection(SELL)
            .withRatio("4.2")
            .withAmount("100.00")
            .build()
    );
    exchangeService.addCoreTicket(
        CoreTicketBuilder.createBuilder()
            .withId(2L)
            .withUserId(UUID.randomUUID())
            .withPair(EUR_PLN)
            .withDirection(BUY)
            .withRatio("4.2")
            .withAmount("420.0")
            .build()
    );
    ExchangeResult result = exchangeService.doExchange();
    checkResultValues(result);
    Assertions.assertNotNull(result);
    assertThat(result.getSellExchange().getAmount()).isEqualTo(4200000);
    assertThat(result.getSellExchange().getIdCurrency()).isEqualTo("PLN");
    assertThat(result.getBuyExchange().getAmount()).isEqualTo(1000000);
    assertThat(result.getBuyExchange().getIdCurrency()).isEqualTo("EUR");
    assertThat(result.getBuyTicketAfterExchange().getAmount()).isEqualTo(0);
    assertThat(result.getBuyTicketAfterExchange().getIdCurrency()).isEqualTo("PLN");
    assertThat(result.getSellTicketAfterExchange().getAmount()).isEqualTo(0);
    assertThat(result.getSellTicketAfterExchange().getIdCurrency()).isEqualTo("EUR");
    assertThat(exchangeService.doExchange()).isNull();
  }

  @Test
  public final void testForexExchange2() throws ExchangeException {
    ExchangeService exchangeService = new ExchangeService(EUR_PLN, new FirstTicketRatioStrategy());
    exchangeService.addCoreTicket(
        CoreTicketBuilder.createBuilder()
            .withId(1L)
            .withUserId(UUID.randomUUID())
            .withPair(EUR_PLN)
            .withDirection(SELL)
            .withRatio("4.2")
            .withAmount("100.00")
            .build()
    );
    exchangeService.addCoreTicket(
        CoreTicketBuilder.createBuilder()
            .withId(2L)
            .withUserId(UUID.randomUUID())
            .withPair(EUR_PLN)
            .withDirection(BUY)
            .withRatio("4.3")
            .withAmount("520.0")
            .build()
    );
    ExchangeResult result = exchangeService.doExchange();
    checkResultValues(result);
    assertThat(exchangeService.doExchange()).isNull();
  }

  @Test
  public final void doExchange_should_returnNullValue_when_noRatioToExchange()
      throws ExchangeException {
    ExchangeService exchangeService = new ExchangeService(EUR_PLN, new FirstTicketRatioStrategy());
    exchangeService.addCoreTicket(
        CoreTicketBuilder.createBuilder()
            .withId(1L)
            .withUserId(UUID.randomUUID())
            .withPair(EUR_PLN)
            .withDirection(SELL)
            .withRatio("4.5")
            .withAmount("520.0")
            .build()
    );
    exchangeService.addCoreTicket(
        CoreTicketBuilder.createBuilder()
            .withId(2L)
            .withUserId(UUID.randomUUID())
            .withPair(EUR_PLN)
            .withDirection(BUY)
            .withRatio("4.0")
            .withAmount("100.0")
            .build()
    );
    assertThat(exchangeService.doExchange()).isNull();
    assertThat(exchangeService.doExchange()).isNull();
  }

  @Test
  public final void doExchange_should_exchangeTicket_when_existsSellTickets()
      throws ExchangeException {
    ExchangeService exchangeService = new ExchangeService(EUR_PLN, new FirstTicketRatioStrategy());
    exchangeService.addCoreTicket(
        CoreTicketBuilder.createBuilder()
            .withId(1L)
            .withUserId(UUID.randomUUID())
            .withPair(EUR_PLN)
            .withDirection(SELL)
            .withRatio("4.5")
            .withAmount("2250.0")
            .build()
    );
    for (long i = 0; i < 5; i++) {
      exchangeService.addCoreTicket(
          CoreTicketBuilder.createBuilder()
              .withId(2L + i)
              .withUserId(UUID.randomUUID())
              .withPair(EUR_PLN)
              .withDirection(BUY)
              .withRatio("4.5")
              .withAmount("100.0")
              .build()
      );
    }

    ExchangeResult result;
    for (int i = 0; i < 5; i++) {
      result = exchangeService.doExchange();
      checkResultValues(result);
    }
    result = exchangeService.doExchange();
    assertThat(result).isNull();
    assertThat(exchangeService.getOrderBookCount(SELL)).isEqualTo(1);
    assertThat(exchangeService.getOrderBookCount(BUY)).isEqualTo(0);
  }

  @Test
  public final void testForexExchange5() throws ExchangeException, InterruptedException {
    ExchangeService cont = new ExchangeService(Pair.CHF_PLN, new FirstTicketRatioStrategy());

    cont.addCoreTicket(
        CoreTicketBuilder.createBuilder()
            .withId(1L)
            .withUserId(UUID.randomUUID())
            .withPair(Pair.CHF_PLN)
            .withDirection(SELL)
            .withRatio("4.0000")
            .withAmount("50.0")
            .build()
    );
    Thread.sleep(100);
    for (int i = 0; i < 5; i++) {
      cont.addCoreTicket(
          CoreTicketBuilder.createBuilder()
              .withId(2L + i)
              .withUserId(UUID.randomUUID())
              .withPair(Pair.CHF_PLN)
              .withDirection(BUY)
              .withRatio("4.50")
              .withAmount("100.0")
              .build()
      );
    }

    ExchangeResult result;
    for (int i = 0; i < 2; i++) {
      result = cont.doExchange();
      checkResultValues(result);
      Assertions.assertNotNull(result);
      assertThat(result.getBuyExchange().getRatio()).isEqualTo(4_0000);
      assertThat(result.getSellExchange().getRatio()).isEqualTo(4_0000);
    }
    assertThat(cont.doExchange()).isNull();
  }

  @Test
  public final void doExchange_should_returnNull_when_allTransactionsFromOneBookSideFinished()
      throws ExchangeException, InterruptedException {
    ExchangeService cont = new ExchangeService(Pair.CHF_PLN, new FirstTicketRatioStrategy());

    for (long i = 1; i <= 5; i++) {
      cont.addCoreTicket(
          CoreTicketBuilder.createBuilder()
              .withId(i)
              .withUserId(UUID.randomUUID())
              .withPair(Pair.CHF_PLN)
              .withDirection(BUY)
              .withRatio("4.50")
              .withAmount("112.5")
              .build()
      );
    }
    Thread.sleep(100);

    cont.addCoreTicket(
        CoreTicketBuilder.createBuilder()
            .withId(100L)
            .withUserId(UUID.randomUUID())
            .withPair(Pair.CHF_PLN)
            .withDirection(SELL)
            .withRatio("4.00")
            .withAmount("50.0")
            .build()
    );

    ExchangeResult result;
    for (int i = 0; i < 2; i++) {
      result = cont.doExchange();
      checkResultValues(result);
      Assertions.assertNotNull(result);
      assertThat(result.getBuyExchange().getRatio()).isEqualTo(4_5000);
      assertThat(result.getSellExchange().getRatio()).isEqualTo(4_5000);
    }
    assertThat(cont.doExchange()).isNull();
  }

  @Test
  public final void testForexExchange9() throws ExchangeException {
    ExchangeService exchangeService = new ExchangeService(
        EUR_PLN, new FirstTicketRatioStrategy());
    exchangeService.addCoreTicket(
        CoreTicketBuilder.createBuilder()
            .withId(1L)
            .withUserId(UUID.randomUUID())
            .withPair(EUR_PLN)
            .withDirection(SELL)
            .withRatio("3.9989")
            .withAmount("99.97")
            .build()
    );
    exchangeService.addCoreTicket(
        CoreTicketBuilder.createBuilder()
            .withId(2L)
            .withUserId(UUID.randomUUID())
            .withPair(EUR_PLN)
            .withDirection(BUY)
            .withRatio("4.01")
            .withAmount("403.99")
            .build()
    );

    ExchangeResult result = exchangeService.doExchange();
    checkResultValues(result);
  }

  @Test
  public final void testPrintStatus() throws ExchangeException {
    ExchangeService exchangeService = new ExchangeService(EUR_PLN, new FirstTicketRatioStrategy());
    exchangeService.addCoreTicket(
        CoreTicketBuilder.createBuilder()
            .withId(1L)
            .withUserId(UUID.randomUUID())
            .withPair(EUR_PLN)
            .withDirection(SELL)
            .withRatio("4.2")
            .withAmount("100.0")
            .build()
    );
    exchangeService.addCoreTicket(
        CoreTicketBuilder.createBuilder()
            .withId(2L)
            .withUserId(UUID.randomUUID())
            .withPair(EUR_PLN)
            .withDirection(BUY)
            .withRatio("4.2")
            .withAmount("420.0")
            .build()
    );
    exchangeService.printStatus();
  }

  @Test
  public final void testForexExchange11() throws ExchangeException {
    ExchangeService exchangeService = new ExchangeService(
        EUR_PLN, new FirstTicketRatioStrategy());
    exchangeService.addCoreTicket(
        CoreTicketBuilder.createBuilder()
            .withId(1L)
            .withUserId(UUID.randomUUID())
            .withPair(EUR_PLN)
            .withDirection(SELL)
            .withRatio("4.0000")
            .withAmount("10000.00")
            .build()
    );
    exchangeService.addCoreTicket(
        CoreTicketBuilder.createBuilder()
            .withId(2L)
            .withUserId(UUID.randomUUID())
            .withPair(EUR_PLN)
            .withDirection(SELL)
            .withRatio("4.0000")
            .withAmount("100.00")
            .build()
    );
    for (int i = 0; i < 10; i++) {
      exchangeService.addCoreTicket(
          CoreTicketBuilder.createBuilder()
              .withId(3L + i)
              .withUserId(UUID.randomUUID())
              .withPair(EUR_PLN)
              .withDirection(BUY)
              .withRatio("4.0000")
              .withAmount("400")
              .build()
      );
      ExchangeResult result = exchangeService.doExchange();
      checkResultValues(result);
    }

    CoreTicket ticket = exchangeService.removeOrder(2L, SELL);
    assertThat(ticket.getId()).isEqualTo(2);
    assertThat(ticket.getAmount()).isEqualTo(100_0000);
  }

  @Test
  public final void testForexExchange12() throws ExchangeException, InterruptedException {
    ExchangeService cont = new ExchangeService(Pair.USD_CHF, new FirstTicketRatioStrategy());
    cont.addCoreTicket(
        CoreTicketBuilder.createBuilder()
            .withId(1L)
            .withUserId(UUID.randomUUID())
            .withPair(Pair.USD_CHF)
            .withDirection(SELL)
            .withRatio("4.00")
            .withAmount("500.0")
            .build()
    );

    Thread.sleep(100);

    for (int i = 0; i < 5; i++) {
      cont.addCoreTicket(
          CoreTicketBuilder.createBuilder()
              .withId(2L)
              .withUserId(UUID.randomUUID())
              .withPair(Pair.USD_CHF)
              .withDirection(BUY)
              .withRatio("9.00")
              .withAmount("400.0")
              .build()
      );
    }

    ExchangeResult result;
    for (int i = 0; i < 3; i++) {
      result = cont.doExchange();
      checkResultValues(result);
      Assertions.assertNotNull(result);
      assertThat(result.getBuyExchange().getRatio()).isEqualTo(4_0000);
      assertThat(result.getSellExchange().getRatio()).isEqualTo(4_0000);
    }
  }

  @Test
  public final void testForexExchange13_shouldReturn_0_04USD()
      throws ExchangeException, InterruptedException {
    ExchangeService exchangeService = new ExchangeService(EUR_PLN, new FirstTicketRatioStrategy());
    exchangeService.addCoreTicket(
        CoreTicketBuilder.createBuilder()
            .withId(1L)
            .withUserId(UUID.randomUUID())
            .withPair(EUR_PLN)
            .withDirection(SELL)
            .withRatio("3.9948")
            .withAmount("3000.0")
            .build()
    );
    Thread.sleep(100);
    exchangeService.addCoreTicket(
        CoreTicketBuilder.createBuilder()
            .withId(9L)
            .withUserId(UUID.randomUUID())
            .withPair(EUR_PLN)
            .withDirection(BUY)
            .withRatio("3.9987")
            .withAmount("7000.0")
            .build()
    );
    ExchangeResult result = exchangeService.doExchange();
    checkResultValues(result);
    Assertions.assertNotNull(result);
    assertThat(result.getBuyExchange().getAmount()).isEqualTo(1752_2779);
    assertThat(result.getSellExchange().getAmount()).isEqualTo(6999_9997);
    assertThat(result.getBuyExchange().getRatio()).isEqualTo(3_9948);
    assertThat(result.getSellExchange().getRatio()).isEqualTo(3_9948);
    assertThat(result.getBuyTicketAfterExchange().getAmount()).isEqualTo(3);
    assertThat(result.getBuyTicketAfterExchange().isFinishOrder()).isTrue();
    assertThat(result.getSellTicketAfterExchange().isFinishOrder()).isFalse();
    assertThat(result.getSellTicketAfterExchange().getAmount()).isEqualTo(1247_7221);
  }

  @Test
  public final void doExchange_shouldReturnZero_when_exchanged4Cents()
      throws ExchangeException, InterruptedException {
    ExchangeService exchangeService = new ExchangeService(EUR_PLN, new FirstTicketRatioStrategy());
    exchangeService.addCoreTicket(
        CoreTicketBuilder.createBuilder()
            .withId(9L)
            .withUserId(UUID.randomUUID())
            .withPair(EUR_PLN)
            .withDirection(BUY)
            .withRatio("3.9987")
            .withAmount("7000.0")
            .build()
    );
    Thread.sleep(100);
    exchangeService.addCoreTicket(
        CoreTicketBuilder.createBuilder()
            .withId(11L)
            .withUserId(UUID.randomUUID())
            .withPair(EUR_PLN)
            .withDirection(SELL)
            .withRatio("3.9948")
            .withAmount("3000.0")
            .build()
    );
    ExchangeResult result = exchangeService.doExchange();
    checkResultValues(result);
    Assertions.assertNotNull(result);
    assertThat(result.getBuyTicket().getAmount()).isEqualTo(
        result.getSellExchange().getAmount() + result.getBuyTicketAfterExchange()
            .getAmount());
    assertThat(result.getSellTicket().getAmount()).isEqualTo(
        result.getBuyExchange().getAmount() + result.getSellTicketAfterExchange()
            .getAmount());
    assertThat(result.getBuyExchange().getAmount()).isEqualTo(1750_5689);
    assertThat(result.getSellExchange().getAmount()).isEqualTo(6999_9998);
    assertThat(result.getBuyExchange().getRatio()).isEqualTo(3_9987);
    assertThat(result.getSellExchange().getRatio()).isEqualTo(3_9987);
    assertThat(result.getSellTicketAfterExchange().getAmount()).isEqualTo(1249_4311);
    assertThat(result.getBuyTicketAfterExchange().getAmount()).isEqualTo(2);
    assertThat(result.getBuyTicketAfterExchange().isFinishOrder()).isTrue();
    assertThat(result.getSellTicketAfterExchange().isFinishOrder()).isFalse();
    assertThat(result.getBuyTicketAfterExchange().isFinishOrder()).isTrue();
    assertThat(result.getSellTicketAfterExchange().isFinishOrder()).isFalse();

  }

  @Test
  public final void testForexExchange15() throws ExchangeException {
    ExchangeService exchangeService = new ExchangeService(Pair.GBP_USD,
        new FirstTicketRatioStrategy());
    exchangeService.addCoreTicket(
        CoreTicketBuilder.createBuilder()
            .withId(9L)
            .withUserId(UUID.randomUUID())
            .withPair(Pair.GBP_USD)
            .withDirection(BUY)
            .withRatio("0.0001")
            .withEpochUTC(1)
            .withAmount("5000.0")
            .build()
    );
    exchangeService.addCoreTicket(
        CoreTicketBuilder.createBuilder()
            .withId(11L)
            .withUserId(UUID.randomUUID())
            .withPair(Pair.GBP_USD)
            .withDirection(SELL)
            .withRatio("0.0001")
            .withEpochUTC(2)
            .withAmount("5000.0")
            .build()
    );
    ExchangeResult result = exchangeService.doExchange();
    checkResultValues(result);
    Assertions.assertNotNull(result);
    assertThat(result.getBuyExchange().getAmount()).isEqualTo(5000_0000);
    assertThat(result.getSellExchange().getAmount()).isEqualTo(5000L);
    assertThat(result.getBuyExchange().getRatio()).isEqualTo(1);
    assertThat(result.getSellExchange().getRatio()).isEqualTo(1);
    assertThat(
        result.getSellTicketAfterExchange().getAmount()).isEqualTo(0);
    assertThat(
        result.getBuyTicketAfterExchange().getAmount()).isEqualTo(
        4999_5000);
    assertThat(result.getBuyTicketAfterExchange().isFinishOrder()).isFalse();
    assertThat(result.getSellTicketAfterExchange().isFinishOrder()).isTrue();

  }

  @Test
  public void getExchangeValue_should_returnValue50ForDirectionBuy_when_amountIs100AndRatio2() {
    ExchangeService exchangeService = new ExchangeService(Pair.EUR_CHF,
        new FirstTicketRatioStrategy());
    CoreTicket coreTicket = CoreTicketBuilder.createBuilder()
        .withId(11L)
        .withUserId(UUID.randomUUID())
        .withPair(Pair.EUR_CHF)
        .withDirection(BUY)
        .withRatio("1.9")
        .withAmount("100")
        .build();
    long exchangeValue = exchangeService.getExchangeValue(coreTicket, 2_0000);
    assertThat(exchangeValue).isEqualTo(50_0000L);
  }

  @Test
  public void getExchangeValue_should_returnValue100ForDirectionSell_when_amountIs100AndRatio2() {
    ExchangeService exchangeService = new ExchangeService(Pair.EUR_CHF,
        new FirstTicketRatioStrategy());
    CoreTicket coreTicket = CoreTicketBuilder.createBuilder()
        .withId(11L)
        .withUserId(UUID.randomUUID())
        .withPair(Pair.EUR_CHF)
        .withDirection(SELL)
        .withRatio("2")
        .withAmount("100")
        .build();
    long exchangeValue = exchangeService.getExchangeValue(coreTicket, 2_0000);
    assertThat(exchangeValue).isEqualTo(100_0000L);
  }

  @Test
  public void removeCancelled_should_returnFalse_when_cancelledTicketIsNotInOrderBook()
      throws ExchangeException {
    ExchangeService exchangeService = new ExchangeService(Pair.EUR_CHF,
        new FirstTicketRatioStrategy());
    CoreTicket coreTicket = CoreTicketBuilder.createBuilder()
        .withId(11L)
        .withUserId(UUID.randomUUID())
        .withPair(Pair.EUR_CHF)
        .withDirection(SELL)
        .withRatio("2")
        .withAmount("100")
        .build();
    assertThat(exchangeService.removeCancelled(coreTicket)).isFalse();
  }

  @Test
  public void removeCancelled_should_returnTrue_when_removeTicketFromOrderBook()
      throws ExchangeException {
    ExchangeService exchangeService = new ExchangeService(Pair.EUR_CHF,
        new FirstTicketRatioStrategy());
    CoreTicket coreTicket = CoreTicketBuilder.createBuilder()
        .withId(11L)
        .withUserId(UUID.randomUUID())
        .withPair(Pair.EUR_CHF)
        .withDirection(SELL)
        .withRatio("2")
        .withAmount("100")
        .build();
    exchangeService.addCoreTicket(coreTicket);
    assertThat(exchangeService.removeCancelled(coreTicket)).isTrue();
  }

  @Test
  public void getFirstBookTicket_should_returnFirstTicket_when_methodCalled()
      throws ExchangeException {
    ExchangeService exchangeService = new ExchangeService(Pair.EUR_CHF,
        new FirstTicketRatioStrategy());
    CoreTicket coreTicket = CoreTicketBuilder.createBuilder()
        .withId(11L)
        .withUserId(UUID.randomUUID())
        .withPair(Pair.EUR_CHF)
        .withDirection(SELL)
        .withRatio("2")
        .withAmount("100")
        .build();
    exchangeService.addCoreTicket(coreTicket);
    exchangeService.addCoreTicket(CoreTicketBuilder.createBuilder()
        .withId(12L)
        .withUserId(UUID.randomUUID())
        .withPair(Pair.EUR_CHF)
        .withDirection(SELL)
        .withRatio("2")
        .withAmount("100")
        .build());
    assertThat(exchangeService.getFirstBookTicket(SELL)).isEqualTo(coreTicket);
  }

  @Test
  public void getTotalTicketOrders_should_returnZero_when_orderBookIsEmpty() {
    ExchangeService exchangeService = new ExchangeService(Pair.GBP_USD,
        new FirstTicketRatioStrategy());
    assertThat(exchangeService.getTotalTicketOrders(SELL)).isEqualTo(0);
    assertThat(exchangeService.getTotalTicketOrders(BUY)).isEqualTo(0);
  }

  @Test
  void getOrderBook_should_returnEmptyOrderBookString_when_orderBookIsEmpty() {
    ExchangeService exchangeService = new ExchangeService(Pair.GBP_USD,
        new FirstTicketRatioStrategy());
    assertThat(exchangeService.getOrderBook(true)).isEqualTo(
        "{\"pair\":\"GBP_USD\",\"full\":true,\"sell\":[],\"buy\":[]}");
  }

  @Test
  void getOrderBook_should_returnSellFilledRecord_when_orderBookHaveOne() throws ExchangeException {
    ExchangeService exchangeService = new ExchangeService(Pair.GBP_PLN,
        new FirstTicketRatioStrategy());
    exchangeService.addCoreTicket(CoreTicketBuilder.createBuilder()
        .withId(12L)
        .withUserId(UUID.randomUUID())
        .withPair(Pair.GBP_PLN)
        .withDirection(SELL)
        .withRatio(2)
        .withAmount("100")
        .build());
    assertThat(exchangeService.getOrderBook(true)).isEqualTo(
        """
            {"pair":"GBP_PLN","full":true,"sell":[{"rate":2,"amount":1000000}],"buy":[]}
            """.trim());
  }

  @Test
  void getOrderBook_should_returnListSortedRatioDescending_when_orderBookHaveMoreSellRecords()
      throws ExchangeException {
    ExchangeService exchangeService = new ExchangeService(Pair.EUR_CHF,
        new FirstTicketRatioStrategy());
    exchangeService.addCoreTicket(CoreTicketBuilder.createBuilder()
        .withId(12L)
        .withUserId(UUID.randomUUID())
        .withPair(Pair.EUR_CHF)
        .withDirection(SELL)
        .withRatio(1)
        .withAmount("100")
        .build());
    exchangeService.addCoreTicket(CoreTicketBuilder.createBuilder()
        .withId(13L)
        .withUserId(UUID.randomUUID())
        .withPair(Pair.EUR_CHF)
        .withDirection(SELL)
        .withRatio(2)
        .withAmount("100")
        .build());
    assertThat(exchangeService.getOrderBook(true)).isEqualTo(
        """
            {"pair":"EUR_CHF","full":true,"sell":[{"rate":2,"amount":1000000},{"rate":1,"amount":1000000}],"buy":[]}
            """.trim());
  }

  @Test
  void getOrderBook_should_returnBuyFilledRecord_when_orderBookHaveOne() throws ExchangeException {
    ExchangeService exchangeService = new ExchangeService(Pair.GBP_USD,
        new FirstTicketRatioStrategy());
    exchangeService.addCoreTicket(CoreTicketBuilder.createBuilder()
        .withId(12L)
        .withUserId(UUID.randomUUID())
        .withPair(Pair.GBP_USD)
        .withDirection(BUY)
        .withRatio(2)
        .withAmount("100")
        .build());
    assertThat(exchangeService.getOrderBook(true)).isEqualTo(
        """
            {"pair":"GBP_USD","full":true,"sell":[],"buy":[{"rate":2,"amount":1000000}]}
            """.trim());
  }

  @Test
  void getOrderBook_should_returnListSortedRatioDescending_when_orderBookHaveMoreBuyRecords()
      throws ExchangeException {
    ExchangeService exchangeService = new ExchangeService(Pair.GBP_USD,
        new FirstTicketRatioStrategy());
    exchangeService.addCoreTicket(CoreTicketBuilder.createBuilder()
        .withId(12L)
        .withUserId(UUID.randomUUID())
        .withPair(Pair.GBP_USD)
        .withDirection(BUY)
        .withRatio(1)
        .withAmount("100")
        .build());
    exchangeService.addCoreTicket(CoreTicketBuilder.createBuilder()
        .withId(13L)
        .withUserId(UUID.randomUUID())
        .withPair(Pair.GBP_USD)
        .withDirection(BUY)
        .withRatio(2)
        .withAmount("100")
        .build());
    assertThat(exchangeService.getOrderBook(true)).isEqualTo(
        """
            {"pair":"GBP_USD","full":true,"sell":[],"buy":[{"rate":2,"amount":1000000},{"rate":1,"amount":1000000}]}
            """.trim());
  }

  @Test
  void getOrderBook_should_returnSumAmount_when_orderBookHaveMoreTicketsWithSameSellPrice()
      throws ExchangeException {
    ExchangeService exchangeService = new ExchangeService(Pair.EUR_CHF,
        new FirstTicketRatioStrategy());
    exchangeService.addCoreTicket(CoreTicketBuilder.createBuilder()
        .withId(12L)
        .withUserId(UUID.randomUUID())
        .withPair(Pair.EUR_CHF)
        .withDirection(SELL)
        .withRatio(2)
        .withAmount(10000)
        .build());
    exchangeService.addCoreTicket(CoreTicketBuilder.createBuilder()
        .withId(12L)
        .withUserId(UUID.randomUUID())
        .withPair(Pair.EUR_CHF)
        .withDirection(SELL)
        .withRatio(2)
        .withAmount("100")
        .build());
    assertThat(exchangeService.getOrderBook(true)).isEqualTo(
        """
            {"pair":"EUR_CHF","full":true,"sell":[{"rate":2,"amount":1010000}],"buy":[]}
            """.trim());
  }

  @Test
  void getOrderBook_should_returnSumAmount_when_orderBookHaveMoreTicketsWithSameBuyPrice()
      throws ExchangeException {
    ExchangeService exchangeService = new ExchangeService(Pair.GBP_USD,
        new FirstTicketRatioStrategy());
    exchangeService.addCoreTicket(CoreTicketBuilder.createBuilder()
        .withId(12L)
        .withUserId(UUID.randomUUID())
        .withPair(Pair.GBP_USD)
        .withDirection(BUY)
        .withRatio(2)
        .withAmount("100")
        .build());
    exchangeService.addCoreTicket(CoreTicketBuilder.createBuilder()
        .withId(12L)
        .withUserId(UUID.randomUUID())
        .withPair(Pair.GBP_USD)
        .withDirection(BUY)
        .withRatio(2)
        .withAmount("100")
        .build());
    assertThat(exchangeService.getOrderBook(true)).isEqualTo(
        """
            {"pair":"GBP_USD","full":true,"sell":[],"buy":[{"rate":2,"amount":2000000}]}
            """.trim());
  }
}