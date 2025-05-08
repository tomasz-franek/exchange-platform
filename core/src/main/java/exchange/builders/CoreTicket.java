package exchange.builders;

import static exchange.builders.CoreTicketProperties.DECIMAL_PLACES;

import exchange.app.internal.api.model.Direction;
import exchange.app.internal.api.model.Pair;
import exchange.utils.CurrencyUtils;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;
import java.math.RoundingMode;
import lombok.Getter;

@Getter
public class CoreTicket {

  private final long id;
  private final long value;
  private final long ratio;
  private final long idUser;
  private Pair pair;
  private Direction direction;
  private final long epochUTC;

  public CoreTicket(@NotNull Long id, @NotNull long value, @NotNull long ratio,
      @NotNull long epochUTC, final @NotNull long idUser) {
    assert id != null;
    assert id > 0;
    assert value >= 0;
    assert ratio > 0;
    assert epochUTC > 0;
    assert idUser > 0;
    this.id = id;
    this.value = value;
    this.ratio = ratio;
    this.epochUTC = epochUTC;
    this.idUser = idUser;
  }

  public CoreTicket(@NotNull Long id, @NotNull long value, @NotNull long ratio,
      @NotNull long epochUTC, @NotNull long idUser,
      @NotNull Pair pair, @NotNull Direction direction) {
    this(id, value, ratio, epochUTC, idUser);
    assert pair != null;
    assert direction != null;
    this.pair = pair;
    this.direction = direction;
  }

  public CoreTicket newValue(long value, long epochUTC) {
    return newValue(value, epochUTC, this.id);
  }

  public CoreTicket newValue(long newValue, long epochUTC, long coreTicketId)
      throws ArithmeticException {
    assert newValue >= 0;
    assert epochUTC > 0;
    assert coreTicketId > 0;
    if (this.value >= newValue) {
      return new CoreTicket(coreTicketId, newValue, this.ratio, epochUTC, this.idUser, this.pair,
          this.direction);
    } else {
      throw new ArithmeticException(
          String.format("Value %d is bigger than current value %d", newValue, this.value));
    }
  }

  public BigDecimal getFinancialValue() {
    return BigDecimal.valueOf(this.value).movePointLeft(DECIMAL_PLACES)
        .setScale(2, RoundingMode.FLOOR);
  }

  public BigDecimal getRatioValue() {
    return BigDecimal.valueOf(this.ratio).movePointLeft(DECIMAL_PLACES);
  }

  @Override
  public String toString() {
    return String.format("valueAmount : '%s' %s ratio : '%s'", this.getFinancialValue(),
        CurrencyUtils.pairToCurrency(this.pair, this.direction), this.getRatioValue());
  }

  public String getIdCurrency() {
    return CurrencyUtils.pairToCurrency(this.pair, this.direction);
  }

  public boolean isFinishOrder() {
    return this.value < CoreTicketProperties.ROUNDING;
  }
}
