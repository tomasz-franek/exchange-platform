package org.exchange.builders;


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
  protected long value;
  protected Direction direction;
  protected UUID idUser = null;
  protected boolean flagCancelled = false;
  protected boolean flagSaved = false;
  protected boolean finishOrder = false;

  public CoreTicketBuilder() {

  }


  public CoreTicket build() {
    return new CoreTicket(
        this.id,
        this.value,
        this.ratio,
        this.epochUTC,
        this.idUser,
        this.pair,
        this.direction);
  }

  public static CoreTicketBuilder createBuilder() {

    return new CoreTicketBuilder();
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

  public CoreTicketBuilder withIdUser(UUID idUser) {

    this.idUser = idUser;
    return this;
  }

  public CoreTicketBuilder withDirection(Direction direction) {

    this.direction = direction;
    return this;
  }

  public CoreTicketBuilder withValue(long value) {

    this.value = value;
    return this;
  }

  public CoreTicketBuilder withValue(String value) {

    BigDecimal bigDecimalRatio = new BigDecimal(value);
    bigDecimalRatio = bigDecimalRatio.movePointRight(CoreTicketProperties.DECIMAL_PLACES);
    this.value = bigDecimalRatio.longValue();
    return this;
  }

  public CoreTicketBuilder withEpochUTC(long epochUTC) {

    this.epochUTC = epochUTC;
    return this;
  }

}
