package exchange.builders;


import exchange.app.internal.api.model.Direction;
import exchange.app.internal.api.model.Pair;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;
import lombok.Getter;

@Getter
public class CoreTicketBuilder {

  protected Long id;
  protected long epochUTC = System.currentTimeMillis();
  protected Pair pair;
  protected long ratio;
  protected long valueAmount;
  protected Direction direction;
  protected Long idUser = null;
  protected boolean flagCancelled = false;
  protected boolean flagSaved = false;
  protected boolean finishOrder = false;

  public CoreTicketBuilder() {

  }


  public CoreTicket build() {
    return new CoreTicket(
        this.id,
        this.valueAmount,
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

  public CoreTicketBuilder withIdUser(Long idUser) {

    this.idUser = idUser;
    return this;
  }

  public CoreTicketBuilder withDirection(Direction direction) {

    this.direction = direction;
    return this;
  }

  public CoreTicketBuilder withValueAmount(long valueAmount) {

    this.valueAmount = valueAmount;
    return this;
  }

  public CoreTicketBuilder withValueAmount(String valueAmount) {

    BigDecimal bigDecimalRatio = new BigDecimal(valueAmount);
    bigDecimalRatio = bigDecimalRatio.movePointRight(CoreTicketProperties.DECIMAL_PLACES);
    this.valueAmount = bigDecimalRatio.longValue();
    return this;
  }

  public CoreTicketBuilder withEpochUTC(long epochUTC) {

    this.epochUTC = epochUTC;
    return this;
  }

}
