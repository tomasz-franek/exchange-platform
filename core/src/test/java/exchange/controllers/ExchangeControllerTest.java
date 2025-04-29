package exchange.controllers;

import static org.assertj.core.api.AssertionsForClassTypes.assertThat;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.fail;

import exchange.app.api.model.Direction;
import exchange.app.api.model.Pair;
import exchange.builders.CoreTicket;
import exchange.builders.CoreTicketBuilder;
import exchange.data.ExchangeResult;
import exchange.exceptions.ExchangeException;
import java.math.BigDecimal;
import org.junit.jupiter.api.Test;

class ExchangeControllerTest {

  @Test
  public final void testForexExchange1() throws ExchangeException {
    ExchangeController controller = new ExchangeController(Pair.EUR_PLN);
    controller.addCoreTicket(
        CoreTicketBuilder.createBuilder()
            .withId(1L)
            .withIdUser(1L)
            .withPair(Pair.EUR_PLN)
            .withDirection(Direction.SELL)
            .withRatio("4.2")
            .withValueAmount("100.00")
            .build()
    );
    controller.addCoreTicket(
        CoreTicketBuilder.createBuilder()
            .withId(2L)
            .withIdUser(1L)
            .withPair(Pair.EUR_PLN)
            .withDirection(Direction.BUY)
            .withRatio("4.2")
            .withValueAmount("420.0")
            .build()
    );
    ExchangeResult result = controller.doExchange();
    checkResultValues(result);
    assertEquals(new BigDecimal("420.00"), result.getOppositeExchange().getFinancialValue());
    assertEquals("PLN", result.getOppositeExchange().getIdCurrency());
    assertEquals(new BigDecimal("100.00"), result.getOrderExchange().getFinancialValue());
    assertEquals("EUR", result.getOrderExchange().getIdCurrency());
    assertEquals(new BigDecimal("0.00"), result.getOrderTicketAfterExchange().getFinancialValue());
    assertEquals("PLN", result.getOrderTicketAfterExchange().getIdCurrency());
    assertEquals(new BigDecimal("0.00"),
        result.getOppositeTicketAfterExchange().getFinancialValue());
    assertEquals("EUR", result.getOppositeTicketAfterExchange().getIdCurrency());
    assertThat(controller.doExchange()).isNull();
  }

  @Test
  public final void testForexExchange2() throws ExchangeException {
    ExchangeController controller = new ExchangeController(Pair.EUR_PLN);
    controller.addCoreTicket(
        CoreTicketBuilder.createBuilder()
            .withId(1L)
            .withIdUser(1L)
            .withPair(Pair.EUR_PLN)
            .withDirection(Direction.SELL)
            .withRatio("4.2")
            .withValueAmount("100.00")
            .build()
    );
    controller.addCoreTicket(
        CoreTicketBuilder.createBuilder()
            .withId(2L)
            .withIdUser(1L)
            .withPair(Pair.EUR_PLN)
            .withDirection(Direction.BUY)
            .withRatio("4.3")
            .withValueAmount("520.0")
            .build()
    );
    ExchangeResult result = controller.doExchange();
    checkResultValues(result);
    assertThat(controller.doExchange()).isNull();
  }

  @Test
  public final void doExchange_should_returnNullValue_when_noRatioToExchange()
      throws ExchangeException {
    ExchangeController controller = new ExchangeController(Pair.EUR_PLN);
    controller.addCoreTicket(
        CoreTicketBuilder.createBuilder()
            .withId(1L)
            .withIdUser(1L)
            .withPair(Pair.EUR_PLN)
            .withDirection(Direction.SELL)
            .withRatio("4.5")
            .withValueAmount("520.0")
            .build()
    );
    controller.addCoreTicket(
        CoreTicketBuilder.createBuilder()
            .withId(2L)
            .withIdUser(1L)
            .withPair(Pair.EUR_PLN)
            .withDirection(Direction.BUY)
            .withRatio("4.0")
            .withValueAmount("100.0")
            .build()
    );
    assertThat(controller.doExchange()).isNull();
    assertThat(controller.doExchange()).isNull();
  }


  @Test
  public final void doExchange_should_exchangeTicket_when_existsOppositeTickets()
      throws ExchangeException {
    ExchangeController controller = new ExchangeController(Pair.EUR_PLN);
    controller.addCoreTicket(
        CoreTicketBuilder.createBuilder()
            .withId(1L)
            .withIdUser(1L)
            .withPair(Pair.EUR_PLN)
            .withDirection(Direction.SELL)
            .withRatio("4.5")
            .withValueAmount("2250.0")
            .build()
    );
    for (long i = 0; i < 5; i++) {
      controller.addCoreTicket(
          CoreTicketBuilder.createBuilder()
              .withId(2L + i)
              .withIdUser(1L)
              .withPair(Pair.EUR_PLN)
              .withDirection(Direction.BUY)
              .withRatio("4.5")
              .withValueAmount("100.0")
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
    assertThat(result.getOppositeExchange().getDirection()).isEqualTo(Direction.BUY);
    assertThat(result.getOrderExchange().getDirection()).isEqualTo(Direction.SELL);
    assertThat(result.getOrderTicketAfterExchange().getDirection()).isEqualTo(Direction.BUY);
    assertThat(result.getOppositeTicketAfterExchange().getDirection()).isEqualTo(Direction.SELL);
  }

  @Test
  public final void testForexExchange5() throws ExchangeException, InterruptedException {
    ExchangeController cont = new ExchangeController(Pair.CHF_PLN);

    cont.addCoreTicket(
        CoreTicketBuilder.createBuilder()
            .withId(1L)
            .withIdUser(1L)
            .withPair(Pair.CHF_PLN)
            .withDirection(Direction.SELL)
            .withRatio("4.0000")
            .withValueAmount("50.0")
            .build()
    );
    Thread.sleep(100);
    for (int i = 0; i < 5; i++) {
      cont.addCoreTicket(
          CoreTicketBuilder.createBuilder()
              .withId(2L + i)
              .withIdUser(1L)
              .withPair(Pair.CHF_PLN)
              .withDirection(Direction.BUY)
              .withRatio("4.50")
              .withValueAmount("100.0")
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
              .withDirection(Direction.BUY)
              .withRatio("4.50")
              .withValueAmount("112.5")
              .build()
      );
    }
    Thread.sleep(100);

    cont.addCoreTicket(
        CoreTicketBuilder.createBuilder()
            .withId(100L)
            .withIdUser(1L)
            .withPair(Pair.CHF_PLN)
            .withDirection(Direction.SELL)
            .withRatio("4.00")
            .withValueAmount("50.0")
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
        Pair.EUR_PLN);
    controller.addCoreTicket(
        CoreTicketBuilder.createBuilder()
            .withId(1L)
            .withIdUser(1L)
            .withPair(Pair.EUR_PLN)
            .withDirection(Direction.SELL)
            .withRatio("3.9989")
            .withValueAmount("99.97")
            .build()
    );
    controller.addCoreTicket(
        CoreTicketBuilder.createBuilder()
            .withId(2L)
            .withIdUser(1L)
            .withPair(Pair.EUR_PLN)
            .withDirection(Direction.BUY)
            .withRatio("4.01")
            .withValueAmount("403.99")
            .build()
    );

    ExchangeResult result = controller.doExchange();
    checkResultValues(result);
  }

  @Test
  public final void testPrintStatus() throws ExchangeException {
    ExchangeController controller = new ExchangeController(Pair.EUR_PLN);
    controller.addCoreTicket(
        CoreTicketBuilder.createBuilder()
            .withId(1L)
            .withIdUser(1L)
            .withPair(Pair.EUR_PLN)
            .withDirection(Direction.SELL)
            .withRatio("4.2")
            .withValueAmount("100.0")
            .build()
    );
    controller.addCoreTicket(
        CoreTicketBuilder.createBuilder()
            .withId(2L)
            .withIdUser(1L)
            .withPair(Pair.EUR_PLN)
            .withDirection(Direction.BUY)
            .withRatio("4.2")
            .withValueAmount("420.0")
            .build()
    );
    controller.printStatus();
  }

  @Test
  public final void testForexExchange11() throws ExchangeException {
    ExchangeController controller = new ExchangeController(
        Pair.EUR_PLN);
    controller.addCoreTicket(
        CoreTicketBuilder.createBuilder()
            .withId(1L)
            .withIdUser(1L)
            .withPair(Pair.EUR_PLN)
            .withDirection(Direction.SELL)
            .withRatio("4.0000")
            .withValueAmount("10000.00")
            .build()
    );
    controller.addCoreTicket(
        CoreTicketBuilder.createBuilder()
            .withId(2L)
            .withIdUser(1L)
            .withPair(Pair.EUR_PLN)
            .withDirection(Direction.SELL)
            .withRatio("4.0000")
            .withValueAmount("100.00")
            .build()
    );
    for (int i = 0; i < 10; i++) {
      controller.addCoreTicket(
          CoreTicketBuilder.createBuilder()
              .withId(3L + i)
              .withIdUser(1L)
              .withPair(Pair.EUR_PLN)
              .withDirection(Direction.BUY)
              .withRatio("4.0000")
              .withValueAmount("400")
              .build()
      );
      ExchangeResult result = controller.doExchange();
      checkResultValues(result);
    }

    CoreTicket ticket = controller.removeOrder(2L, Direction.SELL);
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
            .withDirection(Direction.SELL)
            .withRatio("4.00")
            .withValueAmount("500.0")
            .build()
    );

    Thread.sleep(100);

    for (int i = 0; i < 5; i++) {
      cont.addCoreTicket(
          CoreTicketBuilder.createBuilder()
              .withId(2L)
              .withIdUser(1L)
              .withPair(Pair.USD_CHF)
              .withDirection(Direction.BUY)
              .withRatio("9.00")
              .withValueAmount("400.0")
              .build()
      );
    }

    ExchangeResult result;
    for (int i = 0; i < 3; i++) {
      result = cont.doExchange();
      checkResultValues(result);
      assertEquals(4_0000, result.getOrderExchange().getRatio());
      assertEquals(4_0000, result.getOppositeExchange().getRatio());
    }
  }

  @Test
  public final void testForexExchange13_shouldReturn_0_04PLN()
      throws ExchangeException, InterruptedException {
    ExchangeController controller = new ExchangeController(Pair.EUR_PLN);
    controller.addCoreTicket(
        CoreTicketBuilder.createBuilder()
            .withId(1L)
            .withIdUser(2L)
            .withPair(Pair.EUR_PLN)
            .withDirection(Direction.SELL)
            .withRatio("3.9948")
            .withValueAmount("3000.0")
            .build()
    );
    Thread.sleep(100);
    controller.addCoreTicket(
        CoreTicketBuilder.createBuilder()
            .withId(9L)
            .withIdUser(2L)
            .withPair(Pair.EUR_PLN)
            .withDirection(Direction.BUY)
            .withRatio("3.9987")
            .withValueAmount("7000.0")
            .build()
    );
    ExchangeResult result = controller.doExchange();
    checkResultValues(result);
    assertEquals(1752_2779, result.getOrderExchange().getValue());
    assertEquals(6999_9997, result.getOppositeExchange().getValue());
    assertEquals(3_9948, result.getOrderExchange().getRatio());
    assertEquals(3_9948, result.getOppositeExchange().getRatio());
    assertEquals(0_0003, result.getOrderTicketAfterExchange().getValue());
    assertThat(result.getOrderTicketAfterExchange().isFinishOrder()).isTrue();
    assertThat(result.getOppositeTicketAfterExchange().isFinishOrder()).isFalse();
    assertEquals(1247_7221,
        result.getOppositeTicketAfterExchange().getValue());
  }

  @Test
  public final void testForexExchange14_shouldReturn_0_04PLN()
      throws ExchangeException, InterruptedException {
    ExchangeController controller = new ExchangeController(Pair.EUR_PLN);
    controller.addCoreTicket(
        CoreTicketBuilder.createBuilder()
            .withId(9L)
            .withIdUser(1L)
            .withPair(Pair.EUR_PLN)
            .withDirection(Direction.BUY)
            .withRatio("3.9987")
            .withValueAmount("7000.0")
            .build()
    );
    Thread.sleep(100);
    controller.addCoreTicket(
        CoreTicketBuilder.createBuilder()
            .withId(11L)
            .withIdUser(2L)
            .withPair(Pair.EUR_PLN)
            .withDirection(Direction.SELL)
            .withRatio("3.9948")
            .withValueAmount("3000.0")
            .build()
    );
    ExchangeResult result = controller.doExchange();
    checkResultValues(result);
    assertThat(result.getOrderTicket().getValue()).isEqualTo(
        result.getOppositeExchange().getValue() + result.getOrderTicketAfterExchange().getValue());
    assertThat(result.getOppositeTicket().getValue()).isEqualTo(
        result.getOrderExchange().getValue() + result.getOppositeTicketAfterExchange().getValue());
    assertEquals(1750_5689, result.getOrderExchange().getValue());
    assertEquals(6999_9998, result.getOppositeExchange().getValue());
    assertEquals(3_9987, result.getOrderExchange().getRatio());
    assertEquals(3_9987, result.getOppositeExchange().getRatio());
    assertEquals(1249_4311,
        result.getOppositeTicketAfterExchange().getValue());
    assertEquals(0_0002, result.getOrderTicketAfterExchange().getValue());
    assertThat(result.getOrderTicketAfterExchange().isFinishOrder()).isTrue();
    assertThat(result.getOppositeTicketAfterExchange().isFinishOrder()).isFalse();
    assertThat(result.getOrderTicketAfterExchange().isFinishOrder()).isTrue();
    assertThat(result.getOppositeTicketAfterExchange().isFinishOrder()).isFalse();

  }

  @Test
  public final void testForexExchange15() throws ExchangeException, InterruptedException {
    ExchangeController controller = new ExchangeController(Pair.EUR_PLN);
    controller.addCoreTicket(
        CoreTicketBuilder.createBuilder()
            .withId(9L)
            .withIdUser(1L)
            .withPair(Pair.EUR_PLN)
            .withDirection(Direction.BUY)
            .withRatio("0.0001")
            .withValueAmount("5000.0")
            .build()
    );
    Thread.sleep(100);
    controller.addCoreTicket(
        CoreTicketBuilder.createBuilder()
            .withId(11L)
            .withIdUser(2L)
            .withPair(Pair.EUR_PLN)
            .withDirection(Direction.SELL)
            .withRatio("0.0001")
            .withValueAmount("5000.0")
            .build()
    );
    ExchangeResult result = controller.doExchange();
    checkResultValues(result);
    assertEquals(new BigDecimal("5000.00"), result.getOrderExchange().getFinancialValue());
    assertEquals(new BigDecimal("0.50"), result.getOppositeExchange().getFinancialValue());
    assertThat(result.getOrderExchange().getRatio()).isEqualTo(1);
    assertThat(result.getOppositeExchange().getRatio()).isEqualTo(1);
    assertEquals(new BigDecimal("0.00"),
        result.getOppositeTicketAfterExchange().getFinancialValue());
    assertEquals(new BigDecimal("4999.50"),
        result.getOrderTicketAfterExchange().getFinancialValue());
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
        .withDirection(Direction.BUY)
        .withRatio("1.9")
        .withValueAmount("100")
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
        .withDirection(Direction.SELL)
        .withRatio("2")
        .withValueAmount("100")
        .build();
    long exchangeValue = controller.getExchangeValue(coreTicket, 2_0000);
    assertThat(exchangeValue).isEqualTo(100_0000L);
  }
}