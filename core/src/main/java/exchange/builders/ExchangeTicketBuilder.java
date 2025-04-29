package exchange.builders;


import exchange.app.api.model.Direction;
import exchange.app.api.model.Pair;
import java.time.LocalDateTime;
import java.util.Calendar;
import java.util.TimeZone;
import lombok.Getter;

@Getter
public class ExchangeTicketBuilder extends CoreTicketBuilder {

  private Long idOrderReverse;
  private LocalDateTime exchangeDateUTC;

  public ExchangeTicketBuilder withIdOrderReverse(Long idOrderReverse) {

    this.idOrderReverse = idOrderReverse;
    return this;
  }

  public ExchangeTicketBuilder withExchangeDateUTC(LocalDateTime exchangeDateUTC) {

    this.exchangeDateUTC = exchangeDateUTC;
    return this;
  }

  public ExchangeTicketBuilder withId(Long id) {

    super.withId(id);
    return this;
  }

  public ExchangeTicketBuilder withPair(Pair pair) {

    super.withPair(pair);
    return this;
  }

  public ExchangeTicketBuilder withRatio(long ratio) {

    super.withRatio(ratio);
    return this;
  }

  public ExchangeTicketBuilder withRatio(String ratio) {

    super.withRatio(ratio);
    return this;
  }

  public ExchangeTicketBuilder withIdUser(Long idUser) {

    super.withIdUser(idUser);
    return this;
  }

  public ExchangeTicketBuilder withDirection(Direction direction) {

    super.withDirection(direction);
    return this;
  }

  public ExchangeTicketBuilder withValueAmount(long valueAmount) {

    super.withValueAmount(valueAmount);
    return this;
  }

  public ExchangeTicketBuilder withValueAmount(String valueAmount) {

    super.withValueAmount(valueAmount);
    return this;
  }

  public ExchangeTicketBuilder withTicketDateUTC(long epochUTC) {

    super.withEpochUTC(epochUTC);
    return this;
  }

  public CoreTicket buildExchangeTicket() {
    Calendar calendar = Calendar.getInstance();
    calendar.setTimeZone(TimeZone.getTimeZone("UTC"));
    return new CoreTicket(this.id, this.valueAmount, this.ratio, calendar.get(Calendar.MILLISECOND),
        this.idUser, this.pair,
        this.direction);
  }

  public static ExchangeTicketBuilder createBuilder() {

    return new ExchangeTicketBuilder();
  }
}
