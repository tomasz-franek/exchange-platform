package exchange.data;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Fail.fail;
import static org.exchange.app.common.api.model.Direction.BUY;
import static org.exchange.app.common.api.model.Direction.SELL;
import static org.exchange.app.common.api.model.Pair.EUR_CHF;
import static org.exchange.app.common.api.model.Pair.EUR_PLN;
import static org.exchange.app.common.api.model.Pair.USD_CHF;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertTrue;

import org.exchange.builders.CoreTicket;
import org.exchange.builders.CoreTicketBuilder;
import org.exchange.data.ExchangeResult;
import org.exchange.exceptions.ExchangeException;
import org.junit.jupiter.api.Test;

class ExchangeResultTest {

  @Test
  public final void testExchangeResult() throws ExchangeException {
    ExchangeResult result = new ExchangeResult(
        CoreTicketBuilder.createBuilder()
            .withId(1L)
            .withIdUser(1L)
            .withPair(EUR_PLN)
            .withDirection(BUY)
            .withRatio("4.2")
            .withValue("100.0")
            .build(),
        CoreTicketBuilder.createBuilder()
            .withId(1L)
            .withIdUser(1L)
            .withPair(EUR_PLN)
            .withDirection(SELL)
            .withRatio("4.2")
            .withValue("200.0")
            .build()
    );
    result.setOppositeTicketAfterExchange(
        CoreTicketBuilder.createBuilder()
            .withId(1L)
            .withIdUser(1L)
            .withPair(EUR_PLN)
            .withDirection(SELL)
            .withRatio("4.2")
            .withValue("220.0")
            .build()
    );
    result.validate();
  }

  @Test
  public final void testValidate() throws ExchangeException {
    ExchangeResult result = new ExchangeResult(
        CoreTicketBuilder.createBuilder()
            .withId(1L)
            .withIdUser(1L)
            .withPair(EUR_PLN)
            .withDirection(BUY)
            .withRatio("4.2")
            .withValue("100.0")
            .build(),
        CoreTicketBuilder.createBuilder()
            .withId(1L)
            .withIdUser(1L)
            .withPair(EUR_PLN)
            .withDirection(SELL)
            .withRatio("4.2")
            .withValue("200.0")
            .build()
    );
    result.setOppositeTicketAfterExchange(
        CoreTicketBuilder.createBuilder()
            .withId(1L)
            .withIdUser(1L)
            .withPair(EUR_PLN)
            .withDirection(SELL)
            .withRatio("4.2")
            .withValue("220.0")
            .build()
    );
    result.validate();
  }

  @Test
  public final void testValidate2() throws ExchangeException {

    ExchangeResult result2 = new ExchangeResult(
        CoreTicketBuilder.createBuilder()
            .withId(1L)
            .withIdUser(1L)
            .withPair(EUR_PLN)
            .withDirection(SELL)
            .withRatio("4.2")
            .withValue("420.0")
            .build(),
        CoreTicketBuilder.createBuilder()
            .withId(1L)
            .withIdUser(1L)
            .withPair(EUR_PLN)
            .withDirection(BUY)
            .withRatio("4.2")
            .withValue("50.0")
            .build()
    );
    result2.setOppositeTicketAfterExchange(
        CoreTicketBuilder.createBuilder()
            .withId(1L)
            .withIdUser(1L)
            .withPair(EUR_PLN)
            .withDirection(BUY)
            .withRatio("4.2")
            .withValue("50.0")
            .build()
    );
    result2.validate();
  }

  @Test
  public final void testValidate3() throws ExchangeException {
    ExchangeResult result3 = new ExchangeResult(null,
        CoreTicketBuilder.createBuilder()
            .withId(1L)
            .withIdUser(1L)
            .withPair(EUR_PLN)
            .withDirection(SELL)
            .withRatio("4.2")
            .withValue("420.0")
            .build()
    );
    assertFalse(result3.validate());
  }

  @Test
  public final void testValidate4() throws ExchangeException {
    ExchangeResult result4 = new ExchangeResult(
        CoreTicketBuilder.createBuilder()
            .withId(1L)
            .withIdUser(1L)
            .withPair(EUR_PLN)
            .withDirection(BUY)
            .withRatio("3.0")
            .withValue("100.0")
            .build(),
        CoreTicketBuilder.createBuilder()
            .withId(1L)
            .withIdUser(1L)
            .withPair(EUR_PLN)
            .withDirection(SELL)
            .withRatio("4.2")
            .withValue("200.0")
            .build());
    result4.setOppositeTicketAfterExchange(new CoreTicket(3L, 100_0000, 4_2000, 1L, 1L,
        EUR_PLN, SELL));
    result4.validate();
  }

  @Test
  public final void testValidate5() throws ExchangeException {
    ExchangeResult result5 = new ExchangeResult(
        new CoreTicket(1L, 300_0000, 3_0000, 1L, 1L, EUR_PLN, SELL),
        new CoreTicket(2L, 200_0000, 4_2000, 1L, 1L, EUR_PLN, BUY));
    result5.setOppositeTicketAfterExchange(
        new CoreTicket(3L, 100_0000, 4_20000, 1L, 1L, EUR_PLN, BUY));
    assertFalse(result5.validate());
  }

  @Test
  public final void testValidate6() throws ExchangeException {
    ExchangeResult result6 = new ExchangeResult(
        new CoreTicket(1L, 300_0000, 3_0000, 1L, 1L, EUR_PLN, SELL),
        new CoreTicket(2L, 10_3448, 2_9000, 1L, 1L, EUR_PLN, BUY));
    result6.setOppositeTicketAfterExchange(new CoreTicket(3L, 90_0000, 3_0000, 2L, 1L,
        EUR_PLN, SELL));
    result6.validate();
  }

  @Test
  public final void testValidate7() throws ExchangeException {
    ExchangeResult result7 = new ExchangeResult(
        new CoreTicket(1L, 100_0000, 3_0000, 1L, 1L, EUR_PLN,
            BUY),
        new CoreTicket(2L, 10_3448, 2_9000, 1L, 1L, EUR_PLN, SELL));
    result7.setOppositeTicketAfterExchange(new CoreTicket(3L, 90_0000, 3_0000, 2L, 1L,
        EUR_PLN, SELL));
    assertFalse(result7.validate());
  }

  @Test
  public final void testValidate8() throws ExchangeException {
    ExchangeResult result8 = new ExchangeResult(null, null);
    assertThat(result8).isNotNull();
    assertFalse(result8.validate());
  }

  @Test
  public final void testValidate9() throws ExchangeException {
    ExchangeResult result9 = new ExchangeResult(
        new CoreTicket(1L, 100_0000, 3_0000, 1L, 1L, EUR_PLN, BUY),
        new CoreTicket(2L, 1_0000, 3_0000, 1L, 1L, EUR_PLN, SELL));
    assertFalse(result9.validate());
  }

  @Test
  public final void testValidate10() throws ExchangeException {
    ExchangeResult result10 = new ExchangeResult(
        new CoreTicket(1L, 200_0000, 4_2000, 1L, 1L, EUR_PLN, BUY),
        new CoreTicket(2L, 200_0000, 4_2000, 1L, 1L, EUR_PLN, SELL));
    result10.setOppositeTicketAfterExchange(
        new CoreTicket(3L, 220_0000, 4_2000, 1L, 1L, EUR_PLN, SELL));
    result10.setOrderTicketAfterExchange(
        new CoreTicket(4L, 100_0000, 4_2000, 1L, 1L, EUR_PLN, BUY));
    assertFalse(result10.validate());
  }

  @Test
  public final void testValidate11() throws ExchangeException {
    ExchangeResult result11 = new ExchangeResult(
        new CoreTicket(1L, 200_0000, 4_2000, 1L, 1L, EUR_PLN, BUY),
        new CoreTicket(2L, 200_0000, 4_2000, 1L, 1L, EUR_PLN, SELL));
    result11.setOppositeTicketAfterExchange(
        new CoreTicket(3L, 220_0000, 4_2000, 2L, 1L, EUR_PLN, SELL));
    result11.setOrderTicketAfterExchange(
        new CoreTicket(4L, 101_0000, 4_2000, 1L, 1L, EUR_PLN, BUY));
    assertFalse(result11.validate());

    result11 = new ExchangeResult(
        new CoreTicket(5L, 200_0000, 4_2000, 1L, 1L, EUR_PLN, BUY),
        new CoreTicket(5L, 200_0000, 4_2000, 1L, 1L, EUR_PLN, SELL));
    result11.setOppositeTicketAfterExchange(
        new CoreTicket(7L, 220_0000, 4_2000, 1L, 1L, EUR_PLN, SELL));
    result11.setOrderTicketAfterExchange(new CoreTicket(8L, 99_0000, 4_2000, 1L, 1L, EUR_PLN, BUY));
    assertFalse(result11.validate());
  }

  @Test
  public final void testConstrictor() {
    ExchangeResult result10 = new ExchangeResult(
        CoreTicketBuilder.createBuilder()
            .withId(1L)
            .withIdUser(1L)
            .withPair(EUR_PLN)
            .withDirection(BUY)
            .withRatio("4.2")
            .withValue("100.0")
            .build(),
        CoreTicketBuilder.createBuilder()
            .withId(1L)
            .withIdUser(1L)
            .withPair(EUR_PLN)
            .withDirection(SELL)
            .withRatio("4.2")
            .withValue("420.0")
            .build(), System.currentTimeMillis());
    assertNotNull(result10);
  }

  @Test
  public final void testValidateExceptions() throws ExchangeException {
    ExchangeResult result10 = new ExchangeResult(
        new CoreTicket(1L, 200_0000, 4_2000, 1L, 1L, EUR_PLN, BUY),
        new CoreTicket(2L, 200_0000, 4_2000, 1L, 1L, EUR_PLN, SELL));
    result10.setOppositeTicketAfterExchange(
        new CoreTicket(3L, 220_0000, 4_2000, 1L, 1L, EUR_PLN, SELL));
    result10.setOrderTicketAfterExchange(
        new CoreTicket(4L, 100_0000, 4_2000, 1L, 1L, EUR_CHF, BUY));

    result10.setOrderExchange(new CoreTicket(5L, 100_0000, 4_2000, 1L, 1L, EUR_PLN, BUY));
    result10.setOrderExchange(new CoreTicket(6L, 200_0000, 4_2000, 1L, 1L, EUR_PLN, BUY));
    assertFalse(result10.validate());
  }

  @Test
  public final void testValidateExceptions1() throws ExchangeException {
    ExchangeResult result10 = new ExchangeResult(
        new CoreTicket(1L, 200_0000, 4_2000, 1L, 1L, EUR_PLN, BUY),
        new CoreTicket(2L, 200_0000, 4_2000, 1L, 1L, EUR_PLN, SELL));
    result10.setOppositeTicketAfterExchange(
        new CoreTicket(3L, 220_0000, 4_2000, 1L, 1L, EUR_PLN, SELL));
    result10.setOrderTicketAfterExchange(
        new CoreTicket(4L, 100_0000, 4_1400, 1L, 1L, EUR_PLN, BUY));

    result10.setOrderExchange(new CoreTicket(5L, 100_0000, 4_2000, 1L, 1L, EUR_PLN, BUY));
    result10.setOrderExchange(new CoreTicket(6L, 100_0000, 4_2000, 1L, 1L, EUR_PLN, BUY));
    assertFalse(result10.validate());

  }

  @Test
  public final void testValidateExceptions2() throws ExchangeException {
    ExchangeResult result10 = new ExchangeResult(
        new CoreTicket(1L, 100_0000, 4_2000, 1L, 1L, EUR_PLN, BUY),
        new CoreTicket(2L, 200_0000, 4_2000, 1L, 1L, EUR_PLN, SELL));
    result10.setOppositeTicketAfterExchange(
        new CoreTicket(3L, 220_0000, 4_2000, 1L, 1L, EUR_CHF, SELL));
    result10.setOrderTicketAfterExchange(
        new CoreTicket(4L, 100_0000, 4_2000, 1L, 1L, EUR_PLN, BUY));

    result10.setOrderExchange(new CoreTicket(5L, 100_0000, 4_2000, 1L, 1L, EUR_PLN, BUY));
    result10.setOrderExchange(new CoreTicket(6L, 100_0000, 4_2000, 1L, 1L, EUR_PLN, BUY));
    assertFalse(result10.validate());

  }

  @Test
  public final void testValidateExceptions3() throws ExchangeException {

    ExchangeResult result10 = new ExchangeResult(
        new CoreTicket(1L, 200_0000, 4_2000, 1L, 1L, EUR_PLN, BUY),
        new CoreTicket(2L, 1L, 200_0000, 4_2000, 1L, EUR_PLN, SELL));
    result10.setOppositeTicketAfterExchange(
        new CoreTicket(3L, 220_0000, 4_2000, 1L, 1L, EUR_PLN, SELL));
    result10.setOrderTicketAfterExchange(
        new CoreTicket(4L, 200_0000, 4_2000, 1L, 1L, EUR_PLN, SELL));

    result10.setOrderExchange(new CoreTicket(5L, 100_0000, 4_2000, 1L, 1L, EUR_PLN, BUY));
    result10.setOrderExchange(new CoreTicket(6L, 100_0000, 4_2000, 1L, 1L, EUR_PLN, BUY));
    assertFalse(result10.validate());

  }

  @Test
  public final void testValidateExceptions4() throws ExchangeException {
    ExchangeResult result10 = new ExchangeResult(
        new CoreTicket(1L, 200_0000, 4_2000, 1L, 1L, EUR_PLN, BUY),
        new CoreTicket(2L, 200_0000, 4_2000, 1L, 1L, EUR_PLN, SELL));
    result10.setOppositeTicketAfterExchange(
        new CoreTicket(3L, 220_0000, 4_2000, 1L, 1L, EUR_PLN, BUY));
    result10.setOrderTicketAfterExchange(
        new CoreTicket(4L, 100_0000, 4_2000, 1L, 1L, EUR_PLN, BUY));

    result10.setOrderExchange(new CoreTicket(5L, 100_0000, 4_2000, 1L, 1L, EUR_PLN, BUY));
    result10.setOrderExchange(new CoreTicket(6L, 100_0000, 4_2000, 1L, 1L, EUR_PLN, BUY));
    assertFalse(result10.validate());
  }

  @Test
  public final void testValidateExceptions5() {
    try {
      ExchangeResult result10 = new ExchangeResult(
          new CoreTicket(1L, 200_0000, 4_2000, 1L, 1L, EUR_PLN, BUY), null);
      result10.setOppositeTicketAfterExchange(null);
    } catch (Exception e) {
      fail();
    }
  }

  @Test
  public final void testValidate12() {
    ExchangeResult result8 = new ExchangeResult(
        new CoreTicket(1L, 200_0000, 4_2000, 1L, 1L, EUR_PLN, BUY),
        new CoreTicket(2L, 480_0000, 4_2000, 1L, 1L, EUR_PLN, SELL));
    assertEquals("EUR_PLN valueAmount : '200.00' PLN ratio : '4.2000' -> 480.00 EUR",
        result8.toString().substring(0, 65));

  }

  @Test
  public final void testValidate13() {
    ExchangeResult result8 = new ExchangeResult(
        new CoreTicket(1L, 100_0000, 4_2000, 1L, 1L, EUR_PLN, BUY),
        new CoreTicket(2L, 420_0000, 4_2000, 1L, 1L, EUR_PLN, SELL));
    assertEquals("EUR_PLN valueAmount : '100.00' PLN ratio : '4.2000' -> 420.00 EUR",
        result8.toString().substring(0, 65));

  }

  @Test
  public final void testValidate14() throws ExchangeException {
    CoreTicket order1 = new CoreTicket(1L, 100_0000, 4_2000, 1L, 1L, EUR_PLN, SELL);
    CoreTicket order2 = new CoreTicket(2L, 420_0000, 4_2000, 1L, 1L, EUR_PLN, SELL);
    ExchangeResult result8 = new ExchangeResult(order1, order2);
    CoreTicket ex = new CoreTicket(3L, 100_0000, 4_2000, 1L, 1L, EUR_PLN, BUY);

    result8.setOrderExchange(ex);
    result8.setOppositeExchange(ex);
    assertFalse(result8.validate());

  }

  @Test
  public final void testValidate15() throws ExchangeException {
    CoreTicket order1 = new CoreTicket(1L, 100_0000, 4_2000, 1L, 1L, EUR_PLN, BUY);
    CoreTicket order2 = new CoreTicket(2L, 420_0000, 4_2000, 1L, 1L, EUR_PLN, BUY);
    ExchangeResult result8 = new ExchangeResult(order1, order2);
    CoreTicket ex = new CoreTicket(3L, 100_0000, 4_2000, 1L, 1L, EUR_PLN, BUY);

    result8.setOrderExchange(ex);
    result8.setOppositeExchange(ex);
    assertFalse(result8.validate());

  }

  @Test
  public final void testValidate16() {
    CoreTicket order1 = new CoreTicket(1L, 100_0000, 4_2000, 1L, 1L, EUR_PLN, BUY);
    CoreTicket order2 = new CoreTicket(2L, 420_0000, 4_2000, 1L, 1L, EUR_PLN, SELL);
    ExchangeResult result8 = new ExchangeResult(order1, order2);
    CoreTicket ex = new CoreTicket(3L, 100_0000, 4_2000, 1L, 1L, EUR_PLN, BUY);

    result8.setOrderExchange(ex);
    result8.setOppositeExchange(ex);
    result8.setOrderTicketAfterExchange(order2);
    try {
      assertFalse(result8.validate());
      fail();
    } catch (Exception e) {
      assertTrue(true);
    }
  }

  @Test
  public final void testValidate17() {
    CoreTicket order1 = new CoreTicket(1L, 100_0000, 4_2000, 1L, 1L, EUR_PLN, BUY);
    CoreTicket order2 = new CoreTicket(2L, 420_0000, 4_2000, 1L, 1L, EUR_PLN, SELL);
    CoreTicket order3 = new CoreTicket(3L, 420_0000, 4_2000, 1L, 1L, USD_CHF, SELL);
    ExchangeResult result8 = new ExchangeResult(order1, order2);
    CoreTicket ex = new CoreTicket(4L, 100_0000, 4_2000, 1L, 1L, EUR_PLN, BUY);

    result8.setOrderExchange(ex);
    result8.setOppositeExchange(ex);
    result8.setOrderTicketAfterExchange(order3);
    try {
      assertFalse(result8.validate());
      fail();
    } catch (Exception e) {
      assertTrue(true);
    }
  }

  @Test
  public final void testValidate18() {
    CoreTicket order1 = new CoreTicket(1L, 100_0000, 4_2000, 1L, 1L, EUR_PLN, BUY);
    CoreTicket order2 = new CoreTicket(2L, 420_0000, 4_2000, 1L, 1L, EUR_PLN, SELL);
    CoreTicket order3 = new CoreTicket(3L, 420_0000, 4_2200, 1L, 1L, EUR_PLN, SELL);
    ExchangeResult result8 = new ExchangeResult(order1, order2);
    CoreTicket ex = new CoreTicket(4L, 100_0000, 4_2200, 1L, 1L, EUR_PLN, BUY);

    result8.setOrderExchange(ex);
    result8.setOppositeExchange(ex);
    result8.setOrderTicketAfterExchange(order3);
    try {
      assertFalse(result8.validate());
      fail();
    } catch (Exception e) {
      assertTrue(true);
    }
  }
}