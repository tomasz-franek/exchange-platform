package org.exchange.app.backend.common.builders;

import static org.junit.jupiter.api.Assertions.assertEquals;

import java.util.UUID;
import org.exchange.app.common.api.model.Direction;
import org.exchange.app.common.api.model.Pair;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

class ExchangeTicketBuilderTest {

  private ExchangeTicketBuilder builder;

  @BeforeEach
  void setUp() {
    builder = ExchangeTicketBuilder.createBuilder();
  }

  @Test
  void withReverseTicketId_should_setCorrectReverseTicketId_when_called() {
    Long reverseId = 12345L;
    builder.withReverseTicketId(reverseId);

    assertEquals(reverseId, builder.getReverseTicketId(),
        "Reverse ticket ID should be set correctly.");
  }

  @Test
  void withId_should_setCorrectId_when_called() {
    Long id = 54321L;
    builder.withId(id);

    assertEquals(id, builder.getId(), "ID should be set correctly in the superclass.");
  }

  @Test
  void withPair_should_setCorrectPair_when_called() {
    Pair pair = Pair.CHF_PLN;
    builder.withPair(pair);

    assertEquals(pair, builder.getPair(), "Pair should be set correctly in the superclass.");
  }

  @Test
  void withRatio_should_setCorrectRatio_when_called() {
    long ratio = 2;
    builder.withRatio(ratio);

    assertEquals(ratio, builder.getRatio(), "Ratio should be set correctly in the superclass.");
  }

  @Test
  void withUserId_should_setCorrectUserId_when_called() {
    UUID userId = UUID.randomUUID();
    builder.withUserId(userId);

    assertEquals(userId, builder.getUserId(), "User ID should be set correctly in the superclass.");
  }

  @Test
  void withDirection_should_setCorrectDirection_when_called() {
    Direction direction = Direction.BUY;
    builder.withDirection(direction);

    assertEquals(direction, builder.getDirection(),
        "Direction should be set correctly in the superclass.");
  }

  @Test
  void withAmount_should_setCorrectAmount_when_called() {
    long amount = 1000L;
    builder.withAmount(amount);

    assertEquals(amount, builder.getAmount(), "Amount should be set correctly in the superclass.");
  }
}
