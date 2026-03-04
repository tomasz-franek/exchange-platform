package org.exchange.app.backend.common.builders;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;

import java.util.UUID;
import org.exchange.app.common.api.model.Direction;
import org.exchange.app.common.api.model.Pair;
import org.junit.jupiter.api.Test;

class CoreTicketBuilderTest {

  private static final Long VALID_ID = 1L;
  private static final long VALID_AMOUNT = 100L;
  private static final long VALID_RATIO = 10L;
  private static final UUID VALID_USER_ID = UUID.randomUUID();
  private static final Pair VALID_PAIR = Pair.EUR_GBP;
  private static final Direction VALID_DIRECTION = Direction.BUY;

  @Test
  void testCreateBuilder() {
    CoreTicketBuilder builder = CoreTicketBuilder.createBuilder();
    assertNotNull(builder);
  }

  @Test
  void testBuildWithRequiredFields() {
    CoreTicketBuilder builder = CoreTicketBuilder.createBuilder()
        .withId(VALID_ID)
        .withAmount(VALID_AMOUNT)
        .withRatio(VALID_RATIO)
        .withPair(Pair.CHF_PLN)
        .withDirection(Direction.BUY)
        .withUserId(UUID.randomUUID());

    CoreTicket ticket = builder.build();
    assertNotNull(ticket);
    assertEquals(VALID_ID, ticket.getId());
    assertEquals(VALID_AMOUNT, ticket.getAmount());
    assertEquals(VALID_RATIO, ticket.getRatio());
  }

  @Test
  void testBuildWithOptionalFields() {
    CoreTicketBuilder builder = CoreTicketBuilder.createBuilder()
        .withId(VALID_ID)
        .withAmount(VALID_AMOUNT)
        .withRatio(VALID_RATIO)
        .withUserId(VALID_USER_ID)
        .withPair(VALID_PAIR)
        .withDirection(VALID_DIRECTION);

    CoreTicket ticket = builder.build();
    assertEquals(VALID_USER_ID, ticket.getUserId());
    assertEquals(VALID_PAIR, ticket.getPair());
    assertEquals(VALID_DIRECTION, ticket.getDirection());
  }

  @Test
  void testWithUserIdString() {
    CoreTicketBuilder builder = CoreTicketBuilder.createBuilder()
        .withUserId(VALID_USER_ID.toString())
        .withId(VALID_ID)
        .withAmount(VALID_AMOUNT)
        .withRatio(VALID_RATIO)
        .withPair(VALID_PAIR)
        .withDirection(VALID_DIRECTION);

    CoreTicket ticket = builder.build();
    assertEquals(VALID_USER_ID, ticket.getUserId());
  }

  @Test
  void testWithAmountString() {
    CoreTicketBuilder builder = CoreTicketBuilder.createBuilder()
        .withAmount("100.00")
        .withId(VALID_ID)
        .withUserId(UUID.randomUUID())
        .withRatio(VALID_RATIO)
        .withDirection(Direction.SELL)
        .withPair(VALID_PAIR);

    CoreTicket ticket = builder.build();
    assertEquals(100_0000L, ticket.getAmount());
  }

  @Test
  void testWithRatioString() {
    CoreTicketBuilder builder = CoreTicketBuilder.createBuilder()
        .withRatio("10.00")
        .withId(VALID_ID)
        .withUserId(VALID_USER_ID)
        .withAmount(VALID_AMOUNT)
        .withDirection(Direction.SELL)
        .withPair(VALID_PAIR);

    CoreTicket ticket = builder.build();
    assertEquals(10_0000L, ticket.getRatio());
  }

  @Test
  void testWithDirectionFromStringB() {
    CoreTicketBuilder builder = CoreTicketBuilder.createBuilder()
        .withDirection("B")
        .withId(VALID_ID)
        .withUserId(VALID_USER_ID)
        .withRatio(VALID_RATIO)
        .withAmount(VALID_AMOUNT)
        .withPair(VALID_PAIR);

    CoreTicket ticket = builder.build();
    assertEquals(Direction.BUY, ticket.getDirection());
  }

  @Test
  void testWithDirectionFromStringS() {
    CoreTicketBuilder builder = CoreTicketBuilder.createBuilder()
        .withDirection("S")
        .withId(VALID_ID)
        .withUserId(VALID_USER_ID)
        .withRatio(VALID_RATIO)
        .withAmount(VALID_AMOUNT)
        .withPair(VALID_PAIR);

    CoreTicket ticket = builder.build();
    assertEquals(Direction.SELL, ticket.getDirection());
  }

  @Test
  void testWithDirectionInvalidString() {
    CoreTicketBuilder builder = CoreTicketBuilder.createBuilder()
        .withDirection("INVALID")
        .withId(VALID_ID)
        .withUserId(VALID_USER_ID)
        .withRatio(VALID_RATIO)
        .withAmount(VALID_AMOUNT)
        .withPair(VALID_PAIR);

    IllegalArgumentException exception = assertThrows(IllegalArgumentException.class,
        builder::build);
    assertThat(exception.getMessage()).isEqualTo("Direction is null");
  }

}
