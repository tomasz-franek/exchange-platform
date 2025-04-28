package exchange.builders;


import exchange.app.api.model.Direction;
import exchange.app.api.model.Pair;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;
import lombok.Getter;

@Getter
public class OrderTicketBuilder {

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

  public OrderTicketBuilder() {

  }


  public CoreTicket build() {
    return new CoreTicket(this.id, this.valueAmount, this.ratio, this.epochUTC, this.pair,
        this.direction);
  }

  public static OrderTicketBuilder createBuilder() {

    return new OrderTicketBuilder();
  }

  public OrderTicketBuilder withId(Long id) {

    this.id = id;
    return this;
  }

  public OrderTicketBuilder withPair(Pair pair) {

    this.pair = pair;
    return this;
  }

  public OrderTicketBuilder withRatio(long ratio) {

    this.ratio = ratio;
    return this;
  }

  public OrderTicketBuilder withRatio(@NotNull String ratio) {
    BigDecimal bigDecimalRatio = new BigDecimal(ratio);
    bigDecimalRatio = bigDecimalRatio.movePointRight(CoreTicketProperties.DECIMAL_PLACES);
    this.ratio = bigDecimalRatio.longValue();
    return this;
  }

  public OrderTicketBuilder withIdUser(Long idUser) {

    this.idUser = idUser;
    return this;
  }

  public OrderTicketBuilder withDirection(Direction direction) {

    this.direction = direction;
    return this;
  }

  public OrderTicketBuilder withValueAmount(long valueAmount) {

    this.valueAmount = valueAmount;
    return this;
  }

  public OrderTicketBuilder withValueAmount(String valueAmount) {

    BigDecimal bigDecimalRatio = new BigDecimal(valueAmount);
    bigDecimalRatio = bigDecimalRatio.movePointRight(CoreTicketProperties.DECIMAL_PLACES);
    this.valueAmount = bigDecimalRatio.longValue();
    return this;
  }

  public OrderTicketBuilder withEpochUTC(long epochUTC) {

    this.epochUTC = epochUTC;
    return this;
  }

}
