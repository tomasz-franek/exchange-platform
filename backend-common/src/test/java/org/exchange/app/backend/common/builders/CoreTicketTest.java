package org.exchange.app.backend.common.builders;

import static org.assertj.core.api.Assertions.assertThat;
import static org.exchange.app.backend.common.builders.CoreTicketProperties.DECIMAL_PLACES;
import static org.exchange.app.common.api.model.Direction.SELL;
import static org.exchange.app.common.api.model.Pair.EUR_PLN;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNotEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.UUID;
import org.exchange.app.backend.common.utils.CurrencyUtils;
import org.exchange.app.common.api.model.Direction;
import org.exchange.app.common.api.model.Pair;
import org.junit.jupiter.api.Test;

class CoreTicketTest {

  private final UUID user1 = UUID.randomUUID();

  @Test
  public final void newAmount_should_generateException_when_newValueToBiggerThanValueOfTheTicket() {
    Throwable exception = assertThrows(ArithmeticException.class, () -> {
      CoreTicket ticket = new CoreTicket(1L, 20_0000, 3_0000, UUID.randomUUID(), EUR_PLN, SELL);
      ticket.newAmount(21_0000, 1L);
    });
    assertThat(exception.getMessage()).isEqualTo(
        "Amount 210000 is bigger than current value 200000");
  }

  @Test
  public final void newAmount_should_returnNewTicketWithNewValue_when_methodIsCalled() {
    CoreTicket ticket = new CoreTicket(1L, 200_0000, 3_0000, UUID.randomUUID(), EUR_PLN, SELL);
    long newAmount = 50_0000;
    CoreTicket ticketAfterSplit = ticket.newAmount(newAmount, 1L);
    assertThat(ticketAfterSplit).isNotNull();
    assertThat(ticketAfterSplit.getAmount()).isEqualTo(newAmount);
  }

  @Test
  void testValidConstructor() {
    Long id = 1L;
    long amount = 100L;
    long ratio = 10L;
    UUID userId = UUID.randomUUID();

    CoreTicket ticket = new CoreTicket(id, amount, ratio, userId);
    assertThat(ticket).isNotNull();
  }

  @Test
  void testConstructorWithNullId() {
    assertThrows(AssertionError.class, () -> new CoreTicket(null, 100L, 10L, UUID.randomUUID()));
  }

  @Test
  void testConstructorWithNegativeId() {
    assertThrows(AssertionError.class, () -> new CoreTicket(-1L, 100L, 10L, UUID.randomUUID()));
  }

  @Test
  void testConstructorWithZeroAmount() {
    Long id = 1L;
    long ratio = 10L;
    UUID userId = UUID.randomUUID();

    assertThat(new CoreTicket(id, 0L, ratio, userId)).isNotNull();
  }

  @Test
  void testConstructorWithNegativeAmount() {
    assertThrows(AssertionError.class, () -> new CoreTicket(1L, -100L, 10L, UUID.randomUUID()));
  }

  @Test
  void testConstructorWithZeroRatio() {
    assertThrows(AssertionError.class, () -> new CoreTicket(1L, 100L, 0L, UUID.randomUUID()));
  }

  @Test
  void testConstructorWithNegativeRatio() {
    assertThrows(AssertionError.class, () -> new CoreTicket(1L, 100L, -10L, UUID.randomUUID()));
  }

  @Test
  void testConstructorWithNullUserId() {
    assertThrows(AssertionError.class, () -> new CoreTicket(1L, 100L, 10L, null));
  }

  @Test
  void testValidConstructor_withPair() {
    Long id = 1L;
    long amount = 100L;
    long ratio = 10L;
    UUID userId = UUID.randomUUID();
    Pair pair = Pair.EUR_GBP;
    Direction direction = Direction.BUY;

    CoreTicket ticket = new CoreTicket(id, amount, ratio, userId, pair, direction);
    assertThat(ticket).isNotNull();
  }

  @Test
  void testConstructorWithNullPair() {
    Long id = 1L;
    long amount = 100L;
    long ratio = 10L;
    UUID userId = UUID.randomUUID();

    assertThrows(AssertionError.class,
        () -> new CoreTicket(id, amount, ratio, userId, null, Direction.SELL));
  }

  @Test
  void testConstructorWithNullDirection() {
    Long id = 1L;
    long amount = 100L;
    long ratio = 10L;
    UUID userId = UUID.randomUUID();
    Pair pair = Pair.CHF_PLN;

    assertThrows(AssertionError.class, () -> new CoreTicket(id, amount, ratio, userId, pair, null));
  }

  @Test
  void testValidNewAmount() {
    Long id = 1L;
    long amount = 100L;
    long ratio = 10L;
    UUID userId = UUID.randomUUID();
    Pair pair = Pair.USD_CHF;

    CoreTicket ticket = new CoreTicket(id, amount, ratio, userId, pair, SELL);
    CoreTicket newTicket = ticket.newAmount(80L);
    assertThat(newTicket).isNotNull();
    assertThat(newTicket.getAmount()).isEqualTo(80L);
  }

  @Test
  void testNewAmountWithNegativeAmount() {
    long id = 1L;
    long amount = 100L;
    long ratio = 10L;
    UUID userId = UUID.randomUUID();
    Pair pair = Pair.USD_CHF;

    CoreTicket ticket = new CoreTicket(id, amount, ratio, userId, pair, SELL);

    assertThrows(AssertionError.class, () -> ticket.newAmount(-10L, id));
  }

  @Test
  void testNewAmountWithZeroCoreTicketId() {
    Long id = 1L;
    long amount = 100L;
    long ratio = 10L;
    UUID userId = UUID.randomUUID();
    Pair pair = Pair.USD_CHF;

    CoreTicket ticket = new CoreTicket(id, amount, ratio, userId, pair, SELL);

    assertThrows(AssertionError.class, () -> ticket.newAmount(80L, 0L));
  }

  @Test
  void testNewAmountExceedsCurrentAmount() {
    long id = 1L;
    long amount = 100L;
    long ratio = 10L;
    UUID userId = UUID.randomUUID();
    Pair pair = Pair.USD_CHF;

    CoreTicket ticket = new CoreTicket(id, amount, ratio, userId, pair, SELL);

    assertThrows(ArithmeticException.class, () -> ticket.newAmount(150L, id));
  }

  @Test
  void testNewAmountWithValidValue() {
    long id = 1L;
    long amount = 100L;
    long ratio = 10L;
    UUID userId = UUID.randomUUID();
    Pair pair = Pair.EUR_GBP;
    Direction direction = Direction.BUY;

    CoreTicket ticket = new CoreTicket(id, amount, ratio, userId, pair, direction);
    CoreTicket newTicket = ticket.newAmount(50L, id);
    assertThat(newTicket.getAmount()).isEqualTo(50);
    assertThat(newTicket.getAmount()).isNotEqualTo(amount);
  }


  @Test
  public void testGetFinancialValue() {
    CoreTicket instance = new CoreTicket();
    instance.setAmount(10000);
    instance.setRatio(2500);
    BigDecimal expected = BigDecimal.valueOf(instance.getAmount()).movePointLeft(DECIMAL_PLACES)
        .setScale(2, RoundingMode.FLOOR);

    assertThat(expected).isEqualTo(instance.getFinancialValue());
  }

  @Test
  public void testGetRatioValue() {
    CoreTicket instance = new CoreTicket();
    instance.setAmount(10000);
    instance.setRatio(2500);
    BigDecimal expected = BigDecimal.valueOf(instance.getRatio()).movePointLeft(DECIMAL_PLACES);

    assertThat(expected).isEqualTo(instance.getRatioValue());
  }

  @Test
  public void testToString() {
    CoreTicket instance = new CoreTicket();
    instance.setAmount(10000);
    instance.setRatio(2500);
    String expectedString = String.format("amount : '%s' %s ratio : '%s'",
        instance.getFinancialValue(),
        CurrencyUtils.pairToCurrency(instance),
        instance.getRatioValue());

    assertEquals(expectedString, instance.toString(), "toString method output is incorrect");
  }


  @Test
  public void testGetFinancialValueWithNegativeAmount() {
    CoreTicket instance = new CoreTicket();
    instance.setRatio(2500);
    instance.setAmount(-10000);
    BigDecimal expected = BigDecimal.valueOf(-10000).movePointLeft(DECIMAL_PLACES)
        .setScale(2, RoundingMode.FLOOR);

    assertEquals(expected, instance.getFinancialValue(),
        "Negative financial value calculation is incorrect");
  }

  @Test
  public void testGetRatioValueWithZero() {
    CoreTicket instance = new CoreTicket();
    instance.setAmount(10000);
    instance.setRatio(0);
    BigDecimal expected = BigDecimal.valueOf(0).movePointLeft(DECIMAL_PLACES);

    assertEquals(expected, instance.getRatioValue(), "Ratio value with zero is incorrect");
  }

  @Test
  public void testToStringWithZeroValues() {
    CoreTicket instance = new CoreTicket();
    instance.setAmount(0);
    instance.setRatio(0);
    String expectedString = String.format("amount : '%s' %s ratio : '%s'",
        instance.getFinancialValue(),
        CurrencyUtils.pairToCurrency(instance),
        instance.getRatioValue());

    assertEquals(expectedString, instance.toString(),
        "toString method output is incorrect for zero values");
  }

  @Test
  public void testEquals_SameObject() {
    CoreTicket ticket1 = new CoreTicket(1L, 10000, 2500, user1, Pair.EUR_GBP, Direction.BUY);
    assertEquals(ticket1, ticket1, "Same object should be equal");
  }

  @Test
  public void testEquals_SameValues() {
    CoreTicket ticket1 = new CoreTicket(1L, 10000, 2500, user1, Pair.EUR_GBP, Direction.BUY);
    CoreTicket ticket2 = new CoreTicket(1L, 10000, 2500, user1, Pair.EUR_GBP, Direction.BUY);
    assertEquals(ticket1, ticket2, "Objects with the same values should be equal");
  }

  @Test
  public void testEquals_DifferentId() {
    CoreTicket ticket1 = new CoreTicket(1L, 10000, 2500, user1, Pair.EUR_GBP, Direction.BUY);
    CoreTicket ticket3 = new CoreTicket(2L, 5000, 1500, UUID.randomUUID(), Pair.USD_CHF, SELL);
    assertNotEquals(ticket1, ticket3, "Objects with different IDs should not be equal");
  }

  @Test
  public void testEquals_DifferentAmount() {
    CoreTicket ticket1 = new CoreTicket(1L, 10000, 2500, user1, Pair.EUR_GBP, Direction.BUY);
    CoreTicket ticket3 = new CoreTicket(2L, 5000, 1500, UUID.randomUUID(), Pair.USD_CHF, SELL);
    ticket3.setId(1);
    ticket3.setAmount(20000);
    assertNotEquals(ticket1, ticket3, "Objects with different amounts should not be equal");
  }

  @Test
  public void testEquals_DifferentUserId() {
    CoreTicket ticket1 = new CoreTicket(1L, 10000, 2500, user1, Pair.EUR_GBP, Direction.BUY);
    CoreTicket ticket3 = new CoreTicket(2L, 5000, 1500, UUID.randomUUID(), Pair.USD_CHF, SELL);
    ticket3.setId(1);
    ticket3.setAmount(10000);
    ticket3.setUserId(UUID.randomUUID());
    assertNotEquals(ticket1, ticket3, "Objects with different user IDs should not be equal");
  }

  @Test
  public void testEquals_NullObject() {
    CoreTicket ticket1 = new CoreTicket(1L, 10000, 2500, user1, Pair.EUR_GBP, Direction.BUY);
    assertNotEquals(null, ticket1, "Should not be equal to null");
  }

  @Test
  public void testEquals_NonCoreTicketObject() {
    CoreTicket ticket1 = new CoreTicket(1L, 10000, 2500, user1, Pair.EUR_GBP, Direction.BUY);
    assertNotEquals("Not a CoreTicket", ticket1, "Should not be equal to a different type");
  }

  @Test
  public void testHashCode_ConsistentWithEquals() {
    CoreTicket ticket1 = new CoreTicket(1L, 10000, 2500, user1, Pair.EUR_GBP, Direction.BUY);
    CoreTicket ticket2 = new CoreTicket(1L, 10000, 2500, user1, Pair.EUR_GBP, Direction.BUY);
    assertEquals(ticket1.hashCode(), ticket2.hashCode(),
        "Equal objects should have the same hash code");
  }

  @Test
  public void testHashCode_NotEqual() {
    CoreTicket ticket1 = new CoreTicket(1L, 10000, 2500, user1, Pair.EUR_GBP, Direction.BUY);
    CoreTicket ticket3 = new CoreTicket(2L, 5000, 1500, UUID.randomUUID(), Pair.USD_CHF, SELL);
    assertNotEquals(ticket1.hashCode(), ticket3.hashCode(),
        "Unequal objects should have different hash codes");
  }

  @Test
  public void testGetIdCurrency() {
    CoreTicket instance = new CoreTicket(1L, 10000, 2500, user1, Pair.EUR_GBP, Direction.BUY);
    String expectedCurrency = "USD";
    instance.setPair(Pair.EUR_USD);

    assertEquals(expectedCurrency, instance.getIdCurrency(), "Currency conversion failed");
  }

  @Test
  public void testIsFinishOrder_WhenAmountIsLessThanRounding() {
    CoreTicket instance = new CoreTicket(1L, 10000, 2500, user1, Pair.EUR_GBP, Direction.BUY);
    instance.setAmount(99);
    assertTrue(instance.isFinishOrder(),
        "Order should be finished when amount is less than rounding");
  }

  @Test
  public void testIsFinishOrder_WhenAmountIsEqualToRounding() {
    CoreTicket instance = new CoreTicket(1L, 10000, 2500, user1, Pair.EUR_GBP, Direction.BUY);
    instance.setAmount(CoreTicketProperties.ROUNDING);
    assertFalse(instance.isFinishOrder(),
        "Order should not be finished when amount is equal to rounding");
  }

  @Test
  public void testIsFinishOrder_WhenAmountIsGreaterThanRounding() {
    CoreTicket instance = new CoreTicket(1L, 10000, 2500, user1, Pair.EUR_GBP, Direction.BUY);
    instance.setAmount(1_0001);
    assertFalse(instance.isFinishOrder(),
        "Order should not be finished when amount is greater than rounding");
  }
}