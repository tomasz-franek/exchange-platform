package org.exchange.internal.app.core.builders;


import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;
import java.util.UUID;
import lombok.Getter;
import org.exchange.app.common.api.model.Direction;
import org.exchange.app.common.api.model.Pair;

@Getter
public class CoreTicketBuilder {

  protected Long id;
  protected long epochUTC = System.currentTimeMillis();
  protected Pair pair;
  protected long ratio;
  protected long amount;
  protected Direction direction;
  protected UUID userId = null;

  public CoreTicketBuilder() {

  }

  public static CoreTicketBuilder createBuilder() {

    return new CoreTicketBuilder();
  }

  public CoreTicket build() {
    return new CoreTicket(
        this.id,
        this.amount,
        this.ratio,
        this.epochUTC,
        this.userId,
        this.pair,
        this.direction);
  }

  public CoreTicketBuilder withId(Long id) {

    this.id = id;
    return this;
  }

  public CoreTicketBuilder withPair(Pair pair) {

    this.pair = pair;
    return this;
  }

  public CoreTicketBuilder withRatio(long ratio) {

    this.ratio = ratio;
    return this;
  }

  public CoreTicketBuilder withRatio(@NotNull String ratio) {
    BigDecimal bigDecimalRatio = new BigDecimal(ratio);
    bigDecimalRatio = bigDecimalRatio.movePointRight(CoreTicketProperties.DECIMAL_PLACES);
    this.ratio = bigDecimalRatio.longValue();
    return this;
  }

  public CoreTicketBuilder withUserId(UUID userId) {

    this.userId = userId;
    return this;
  }

  public CoreTicketBuilder withUserId(String userId) {

    this.userId = UUID.fromString(userId);
    return this;
  }

  public CoreTicketBuilder withDirection(Direction direction) {

    this.direction = direction;
    return this;
  }

  public CoreTicketBuilder withAmount(long amount) {

    this.amount = amount;
    return this;
  }

  public CoreTicketBuilder withAmount(String amount) {

    BigDecimal bigDecimalRatio = new BigDecimal(amount);
    bigDecimalRatio = bigDecimalRatio.movePointRight(CoreTicketProperties.DECIMAL_PLACES);
    this.amount = bigDecimalRatio.longValue();
    return this;
  }

  public CoreTicketBuilder withAmount(Long amount) {
    this.amount = amount;
    return this;
  }

  public CoreTicketBuilder withEpochUTC(long epochUTC) {
    this.epochUTC = epochUTC;
    return this;
  }

}
