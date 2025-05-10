package exchange.controllers;

import static exchange.app.common.api.model.Direction.BUY;
import static exchange.app.common.api.model.Direction.SELL;
import static exchange.app.common.api.model.Pair.EUR_PLN;
import static org.assertj.core.api.AssertionsForClassTypes.assertThat;
import static org.junit.jupiter.api.Assertions.fail;

import exchange.app.common.api.model.Pair;
import exchange.builders.CoreTicket;
import exchange.builders.CoreTicketBuilder;
import exchange.data.ExchangeResult;
import exchange.exceptions.ExchangeException;
import org.junit.jupiter.api.Test;

class ExchangeControllerTest {

  @Test
  public final void testForexExchange1() throws ExchangeException {
    ExchangeController controller = new ExchangeController(EUR_PLN);
    controller.addCoreTicket(
        CoreTicketBuilder.createBuilder()
            .withId(1L)
            .withIdUser(1L)
            .withPair(EUR_PLN)
            .withDirection(SELL)
            .withRatio("4.2")
            .withValue("100.00")
            .build()
    );
    controller.addCoreTicket(
        CoreTicketBuilder.createBuilder()
            .withId(2L)
            .withIdUser(1L)
            .withPair(EUR_PLN)
            .withDirection(BUY)
            .withRatio("4.2")
            .withValue("420.0")
            .build()
    );
    ExchangeResult result = controller.doExchange();
    checkResultValues(result);
    assertThat(result.getOppositeExchange().getValue()).isEqualTo(4200000);
    assertThat(result.getOppositeExchange().getIdCurrency()).isEqualTo("PLN");
    assertThat(result.getOrderExchange().getValue()).isEqualTo(1000000);
    assertThat(result.getOrderExchange().getIdCurrency()).isEqualTo("EUR");
    assertThat(result.getOrderTicketAfterExchange().getValue()).isEqualTo(0);
    assertThat(result.getOrderTicketAfterExchange().getIdCurrency()).isEqualTo("PLN");
    assertThat(result.getOppositeTicketAfterExchange().getValue()).isEqualTo(0);
    assertThat(result.getOppositeTicketAfterExchange().getIdCurrency()).isEqualTo("EUR");
    assertThat(controller.doExchange()).isNull();
  }

  @Test
  public final void testForexExchange2() throws ExchangeException {
    ExchangeController controller = new ExchangeController(EUR_PLN);
    controller.addCoreTicket(
        CoreTicketBuilder.createBuilder()
            .withId(1L)
            .withIdUser(1L)
            .withPair(EUR_PLN)
            .withDirection(SELL)
            .withRatio("4.2")
            .withValue("100.00")
            .build()
    );
    controller.addCoreTicket(
        CoreTicketBuilder.createBuilder()
            .withId(2L)
            .withIdUser(1L)
            .withPair(EUR_PLN)
            .withDirection(BUY)
            .withRatio("4.3")
            .withValue("520.0")
            .build()
    );
    ExchangeResult result = controller.doExchange();
    checkResultValues(result);
    assertThat(controller.doExchange()).isNull();
  }

  @Test
  public final void doExchange_should_returnNullValue_when_noRatioToExchange()
      throws ExchangeException {
    ExchangeController controller = new ExchangeController(EUR_PLN);
    controller.addCoreTicket(
        CoreTicketBuilder.createBuilder()
            .withId(1L)
            .withIdUser(1L)
            .withPair(EUR_PLN)
            .withDirection(SELL)
            .withRatio("4.5")
            .withValue("520.0")
            .build()
    );
    controller.addCoreTicket(
        CoreTicketBuilder.createBuilder()
            .withId(2L)
            .withIdUser(1L)
            .withPair(EUR_PLN)
            .withDirection(BUY)
            .withRatio("4.0")
            .withValue("100.0")
            .build()
    );
    assertThat(controller.doExchange()).isNull();
    assertThat(controller.doExchange()).isNull();
  }


  @Test
  public final void doExchange_should_exchangeTicket_when_existsOppositeTickets()
      throws ExchangeException {
    ExchangeController controller = new ExchangeController(EUR_PLN);
    controller.addCoreTicket(
        CoreTicketBuilder.createBuilder()
            .withId(1L)
            .withIdUser(1L)
            .withPair(EUR_PLN)
            .withDirection(SELL)
            .withRatio("4.5")
            .withValue("2250.0")
            .build()
    );
    for (long i = 0; i < 5; i++) {
      controller.addCoreTicket(
          CoreTicketBuilder.createBuilder()
              .withId(2L + i)
              .withIdUser(1L)
              .withPair(EUR_PLN)
              .withDirection(BUY)
              .withRatio("4.5")
              .withValue("100.0")
              .build()
      );
    }

    ExchangeResult result;
    for (int i = 0; i < 5; i++) {
      result = controller.doExchange();
      checkResultValues(result);
    }
    result = controller.doExchange();
    assertThat(result).isNull();
    assertThat(controller.getBookOrderCount(SELL)).isEqualTo(1);
    assertThat(controller.getBookOrderCount(BUY)).isEqualTo(0);
  }

  private static void checkResultValues(ExchangeResult result) throws ExchangeException {
    if (result == null) {
      fail("Result is null");
    }
    assertThat(result.validate()).isEqualTo(true);
    assertThat(result.getOppositeTicket().getValue()).isEqualTo(
        result.getOppositeTicketAfterExchange().getValue()
            + result.getOrderExchange().getValue());
    assertThat(result.getOrderTicket().getValue()).isEqualTo(
        result.getOrderTicketAfterExchange().getValue()
            + result.getOppositeExchange().getValue());
    assertThat(result.getOrderTicket().getIdCurrency()).isEqualTo(
        result.getOppositeExchange().getIdCurrency());
    assertThat(result.getOppositeTicket().getIdCurrency()).isEqualTo(
        result.getOrderExchange().getIdCurrency());
    assertThat(result.getOppositeExchange().getDirection()).isEqualTo(BUY);
    assertThat(result.getOrderExchange().getDirection()).isEqualTo(SELL);
    assertThat(result.getOrderTicketAfterExchange().getDirection()).isEqualTo(BUY);
    assertThat(result.getOppositeTicketAfterExchange().getDirection()).isEqualTo(SELL);
  }

  @Test
  public final void testForexExchange5() throws ExchangeException, InterruptedException {
    ExchangeController cont = new ExchangeController(Pair.CHF_PLN);

    cont.addCoreTicket(
        CoreTicketBuilder.createBuilder()
            .withId(1L)
            .withIdUser(1L)
            .withPair(Pair.CHF_PLN)
            .withDirection(SELL)
            .withRatio("4.0000")
            .withValue("50.0")
            .build()
    );
    Thread.sleep(100);
    for (int i = 0; i < 5; i++) {
      cont.addCoreTicket(
          CoreTicketBuilder.createBuilder()
              .withId(2L + i)
              .withIdUser(1L)
              .withPair(Pair.CHF_PLN)
              .withDirection(BUY)
              .withRatio("4.50")
              .withValue("100.0")
              .build()
      );
    }

    ExchangeResult result;
    for (int i = 0; i < 2; i++) {
      result = cont.doExchange();
      checkResultValues(result);
      assertThat(result.getOrderExchange().getRatio()).isEqualTo(4_0000);
      assertThat(result.getOppositeExchange().getRatio()).isEqualTo(4_0000);
    }
    assertThat(cont.doExchange()).isNull();
  }

  @Test
  public final void doExchange_should_returnNull_when_allTransactionsFromOneBookSideFinished()
      throws ExchangeException, InterruptedException {
    ExchangeController cont = new ExchangeController(Pair.CHF_PLN);

    for (long i = 1; i <= 5; i++) {
      cont.addCoreTicket(
          CoreTicketBuilder.createBuilder()
              .withId(i)
              .withIdUser(1L)
              .withPair(Pair.CHF_PLN)
              .withDirection(BUY)
              .withRatio("4.50")
              .withValue("112.5")
              .build()
      );
    }
    Thread.sleep(100);

    cont.addCoreTicket(
        CoreTicketBuilder.createBuilder()
            .withId(100L)
            .withIdUser(1L)
            .withPair(Pair.CHF_PLN)
            .withDirection(SELL)
            .withRatio("4.00")
            .withValue("50.0")
            .build()
    );

    ExchangeResult result;
    for (int i = 0; i < 2; i++) {
      result = cont.doExchange();
      checkResultValues(result);
      assertThat(result.getOrderExchange().getRatio()).isEqualTo(4_5000);
      assertThat(result.getOppositeExchange().getRatio()).isEqualTo(4_5000);
    }
    assertThat(cont.doExchange()).isNull();
  }

  @Test
  public final void testForexExchange9() throws ExchangeException {
    ExchangeController controller = new ExchangeController(
        EUR_PLN);
    controller.addCoreTicket(
        CoreTicketBuilder.createBuilder()
            .withId(1L)
            .withIdUser(1L)
            .withPair(EUR_PLN)
            .withDirection(SELL)
            .withRatio("3.9989")
            .withValue("99.97")
            .build()
    );
    controller.addCoreTicket(
        CoreTicketBuilder.createBuilder()
            .withId(2L)
            .withIdUser(1L)
            .withPair(EUR_PLN)
            .withDirection(BUY)
            .withRatio("4.01")
            .withValue("403.99")
            .build()
    );

    ExchangeResult result = controller.doExchange();
    checkResultValues(result);
  }

  @Test
  public final void testPrintStatus() throws ExchangeException {
    ExchangeController controller = new ExchangeController(EUR_PLN);
    controller.addCoreTicket(
        CoreTicketBuilder.createBuilder()
            .withId(1L)
            .withIdUser(1L)
            .withPair(EUR_PLN)
            .withDirection(SELL)
            .withRatio("4.2")
            .withValue("100.0")
            .build()
    );
    controller.addCoreTicket(
        CoreTicketBuilder.createBuilder()
            .withId(2L)
            .withIdUser(1L)
            .withPair(EUR_PLN)
            .withDirection(BUY)
            .withRatio("4.2")
            .withValue("420.0")
            .build()
    );
    controller.printStatus();
  }

  @Test
  public final void testForexExchange11() throws ExchangeException {
    ExchangeController controller = new ExchangeController(
        EUR_PLN);
    controller.addCoreTicket(
        CoreTicketBuilder.createBuilder()
            .withId(1L)
            .withIdUser(1L)
            .withPair(EUR_PLN)
            .withDirection(SELL)
            .withRatio("4.0000")
            .withValue("10000.00")
            .build()
    );
    controller.addCoreTicket(
        CoreTicketBuilder.createBuilder()
            .withId(2L)
            .withIdUser(1L)
            .withPair(EUR_PLN)
            .withDirection(SELL)
            .withRatio("4.0000")
            .withValue("100.00")
            .build()
    );
    for (int i = 0; i < 10; i++) {
      controller.addCoreTicket(
          CoreTicketBuilder.createBuilder()
              .withId(3L + i)
              .withIdUser(1L)
              .withPair(EUR_PLN)
              .withDirection(BUY)
              .withRatio("4.0000")
              .withValue("400")
              .build()
      );
      ExchangeResult result = controller.doExchange();
      checkResultValues(result);
    }

    CoreTicket ticket = controller.removeOrder(2L, SELL);
    assertThat(ticket.getId()).isEqualTo(2);
    assertThat(ticket.getValue()).isEqualTo(100_0000);
  }

  @Test
  public final void testForexExchange12() throws ExchangeException, InterruptedException {
    ExchangeController cont = new ExchangeController(Pair.USD_CHF);
    cont.addCoreTicket(
        CoreTicketBuilder.createBuilder()
            .withId(1L)
            .withIdUser(1L)
            .withPair(Pair.USD_CHF)
            .withDirection(SELL)
            .withRatio("4.00")
            .withValue("500.0")
            .build()
    );

    Thread.sleep(100);

    for (int i = 0; i < 5; i++) {
      cont.addCoreTicket(
          CoreTicketBuilder.createBuilder()
              .withId(2L)
              .withIdUser(1L)
              .withPair(Pair.USD_CHF)
              .withDirection(BUY)
              .withRatio("9.00")
              .withValue("400.0")
              .build()
      );
    }

    ExchangeResult result;
    for (int i = 0; i < 3; i++) {
      result = cont.doExchange();
      checkResultValues(result);
      assertThat(result.getOrderExchange().getRatio()).isEqualTo(4_0000);
      assertThat(result.getOppositeExchange().getRatio()).isEqualTo(4_0000);
    }
  }

  @Test
  public final void testForexExchange13_shouldReturn_0_04USD()
      throws ExchangeException, InterruptedException {
    ExchangeController controller = new ExchangeController(EUR_PLN);
    controller.addCoreTicket(
        CoreTicketBuilder.createBuilder()
            .withId(1L)
            .withIdUser(2L)
            .withPair(EUR_PLN)
            .withDirection(SELL)
            .withRatio("3.9948")
            .withValue("3000.0")
            .build()
    );
    Thread.sleep(100);
    controller.addCoreTicket(
        CoreTicketBuilder.createBuilder()
            .withId(9L)
            .withIdUser(2L)
            .withPair(EUR_PLN)
            .withDirection(BUY)
            .withRatio("3.9987")
            .withValue("7000.0")
            .build()
    );
    ExchangeResult result = controller.doExchange();
    checkResultValues(result);
    assertThat(result.getOrderExchange().getValue()).isEqualTo(1752_2779);
    assertThat(result.getOppositeExchange().getValue()).isEqualTo(6999_9997);
    assertThat(result.getOrderExchange().getRatio()).isEqualTo(3_9948);
    assertThat(result.getOppositeExchange().getRatio()).isEqualTo(3_9948);
    assertThat(result.getOrderTicketAfterExchange().getValue()).isEqualTo(3);
    assertThat(result.getOrderTicketAfterExchange().isFinishOrder()).isTrue();
    assertThat(result.getOppositeTicketAfterExchange().isFinishOrder()).isFalse();
    assertThat(result.getOppositeTicketAfterExchange().getValue()).isEqualTo(1247_7221);
  }

  @Test
  public final void testForexExchange14_shouldReturn_0_04USD()
      throws ExchangeException, InterruptedException {
    ExchangeController controller = new ExchangeController(EUR_PLN);
    controller.addCoreTicket(
        CoreTicketBuilder.createBuilder()
            .withId(9L)
            .withIdUser(1L)
            .withPair(EUR_PLN)
            .withDirection(BUY)
            .withRatio("3.9987")
            .withValue("7000.0")
            .build()
    );
    Thread.sleep(100);
    controller.addCoreTicket(
        CoreTicketBuilder.createBuilder()
            .withId(11L)
            .withIdUser(2L)
            .withPair(EUR_PLN)
            .withDirection(SELL)
            .withRatio("3.9948")
            .withValue("3000.0")
            .build()
    );
    ExchangeResult result = controller.doExchange();
    checkResultValues(result);
    assertThat(result.getOrderTicket().getValue()).isEqualTo(
        result.getOppositeExchange().getValue() + result.getOrderTicketAfterExchange().getValue());
    assertThat(result.getOppositeTicket().getValue()).isEqualTo(
        result.getOrderExchange().getValue() + result.getOppositeTicketAfterExchange().getValue());
    assertThat(result.getOrderExchange().getValue()).isEqualTo(1750_5689);
    assertThat(result.getOppositeExchange().getValue()).isEqualTo(6999_9998);
    assertThat(result.getOrderExchange().getRatio()).isEqualTo(3_9987);
    assertThat(result.getOppositeExchange().getRatio()).isEqualTo(3_9987);
    assertThat(result.getOppositeTicketAfterExchange().getValue()).isEqualTo(1249_4311);
    assertThat(result.getOrderTicketAfterExchange().getValue()).isEqualTo(2);
    assertThat(result.getOrderTicketAfterExchange().isFinishOrder()).isTrue();
    assertThat(result.getOppositeTicketAfterExchange().isFinishOrder()).isFalse();
    assertThat(result.getOrderTicketAfterExchange().isFinishOrder()).isTrue();
    assertThat(result.getOppositeTicketAfterExchange().isFinishOrder()).isFalse();

  }

  @Test
  public final void testForexExchange15() throws ExchangeException {
    ExchangeController controller = new ExchangeController(Pair.GBP_USD);
    controller.addCoreTicket(
        CoreTicketBuilder.createBuilder()
            .withId(9L)
            .withIdUser(1L)
            .withPair(Pair.GBP_USD)
            .withDirection(BUY)
            .withRatio("0.0001")
            .withEpochUTC(1)
            .withValue("5000.0")
            .build()
    );
    controller.addCoreTicket(
        CoreTicketBuilder.createBuilder()
            .withId(11L)
            .withIdUser(2L)
            .withPair(Pair.GBP_USD)
            .withDirection(SELL)
            .withRatio("0.0001")
            .withEpochUTC(2)
            .withValue("5000.0")
            .build()
    );
    ExchangeResult result = controller.doExchange();
    checkResultValues(result);
    assertThat(result.getOrderExchange().getValue()).isEqualTo(5000_0000);
    assertThat(result.getOppositeExchange().getValue()).isEqualTo(5000L);
    assertThat(result.getOrderExchange().getRatio()).isEqualTo(1);
    assertThat(result.getOppositeExchange().getRatio()).isEqualTo(1);
    assertThat(
        result.getOppositeTicketAfterExchange().getValue()).isEqualTo(0);
    assertThat(
        result.getOrderTicketAfterExchange().getValue()).isEqualTo(
        4999_5000);
    assertThat(result.getOrderTicketAfterExchange().isFinishOrder()).isFalse();
    assertThat(result.getOppositeTicketAfterExchange().isFinishOrder()).isTrue();

  }

  @Test
  public void getExchangeValue_should_returnValue50ForDirectionBuy_when_amountIs100AndRatio2() {
    ExchangeController controller = new ExchangeController(Pair.EUR_CHF);
    CoreTicket coreTicket = CoreTicketBuilder.createBuilder()
        .withId(11L)
        .withIdUser(2L)
        .withPair(Pair.EUR_CHF)
        .withDirection(BUY)
        .withRatio("1.9")
        .withValue("100")
        .build();
    long exchangeValue = controller.getExchangeValue(coreTicket, 2_0000);
    assertThat(exchangeValue).isEqualTo(50_0000L);
  }

  @Test
  public void getExchangeValue_should_returnValue100ForDirectionSell_when_amountIs100AndRatio2() {
    ExchangeController controller = new ExchangeController(Pair.EUR_CHF);
    CoreTicket coreTicket = CoreTicketBuilder.createBuilder()
        .withId(11L)
        .withIdUser(2L)
        .withPair(Pair.EUR_CHF)
        .withDirection(SELL)
        .withRatio("2")
        .withValue("100")
        .build();
    long exchangeValue = controller.getExchangeValue(coreTicket, 2_0000);
    assertThat(exchangeValue).isEqualTo(100_0000L);
  }

  @Test
  public void removeCancelled_should_returnFalse_when_cancelledTicketIsNotInOrderBook()
      throws ExchangeException {
    ExchangeController controller = new ExchangeController(Pair.EUR_CHF);
    CoreTicket coreTicket = CoreTicketBuilder.createBuilder()
        .withId(11L)
        .withIdUser(2L)
        .withPair(Pair.EUR_CHF)
        .withDirection(SELL)
        .withRatio("2")
        .withValue("100")
        .build();
    assertThat(controller.removeCancelled(coreTicket)).isFalse();
  }

  @Test
  public void removeCancelled_should_returnTrue_when_removeTicketFromOrderBook()
      throws ExchangeException {
    ExchangeController controller = new ExchangeController(Pair.EUR_CHF);
    CoreTicket coreTicket = CoreTicketBuilder.createBuilder()
        .withId(11L)
        .withIdUser(2L)
        .withPair(Pair.EUR_CHF)
        .withDirection(SELL)
        .withRatio("2")
        .withValue("100")
        .build();
    controller.addCoreTicket(coreTicket);
    assertThat(controller.removeCancelled(coreTicket)).isTrue();
  }

  @Test
  public void getFirstBookTicket_should_returnFirstTicket_when_methodCalled()
      throws ExchangeException {
    ExchangeController controller = new ExchangeController(Pair.EUR_CHF);
    CoreTicket coreTicket = CoreTicketBuilder.createBuilder()
        .withId(11L)
        .withIdUser(2L)
        .withPair(Pair.EUR_CHF)
        .withDirection(SELL)
        .withRatio("2")
        .withValue("100")
        .build();
    controller.addCoreTicket(coreTicket);
    controller.addCoreTicket(CoreTicketBuilder.createBuilder()
        .withId(12L)
        .withIdUser(2L)
        .withPair(Pair.EUR_CHF)
        .withDirection(SELL)
        .withRatio("2")
        .withValue("100")
        .build());
    assertThat(controller.getFirstBookTicket(SELL)).isEqualTo(coreTicket);
  }

  @Test
  public void getTotalTicketOrders_shouldReturnZero_when_orderBookIsEmpty() {
    ExchangeController controller = new ExchangeController(Pair.GBP_USD);
    assertThat(controller.getTotalTicketOrders(SELL)).isEqualTo(0);
    assertThat(controller.getTotalTicketOrders(BUY)).isEqualTo(0);
  }
}