package org.exchange.builders;

import static org.exchange.builders.CoreTicketProperties.DECIMAL_PLACES;

import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.UUID;
import lombok.Getter;
import org.exchange.app.common.api.model.Direction;
import org.exchange.app.common.api.model.Pair;
import org.exchange.utils.CurrencyUtils;

@Getter
public class CoreTicket {

  private final long id;
  private final long amount;
  private final long ratio;
  private final UUID idUser;
  private Pair pair;
  private Direction direction;
  private final long epochUTC;

  public CoreTicket(@NotNull Long id, @NotNull long amount, @NotNull long ratio,
      @NotNull long epochUTC, final @NotNull UUID idUser) {
    assert id != null;
    assert id > 0;
    assert amount >= 0;
    assert ratio > 0;
    assert epochUTC > 0;
    assert idUser != null;
    this.id = id;
    this.amount = amount;
    this.ratio = ratio;
    this.epochUTC = epochUTC;
    this.idUser = idUser;
  }

  public CoreTicket(@NotNull Long id, @NotNull long amount, @NotNull long ratio,
      @NotNull long epochUTC, @NotNull UUID idUser,
      @NotNull Pair pair, @NotNull Direction direction) {
    this(id, amount, ratio, epochUTC, idUser);
    assert pair != null;
    assert direction != null;
    this.pair = pair;
    this.direction = direction;
  }

  public CoreTicket newAmount(long amount, long epochUTC) {
    return newAmount(amount, epochUTC, this.id);
  }

  public CoreTicket newAmount(long newAmount, long epochUTC, long coreTicketId)
      throws ArithmeticException {
    assert newAmount >= 0;
    assert epochUTC > 0;
    assert coreTicketId > 0;
    if (this.amount >= newAmount) {
      return new CoreTicket(coreTicketId, newAmount, this.ratio, epochUTC, this.idUser, this.pair,
          this.direction);
    } else {
      throw new ArithmeticException(
          String.format("Amount %d is bigger than current value %d", newAmount, this.amount));
    }
  }

  public BigDecimal getFinancialValue() {
    return BigDecimal.valueOf(this.amount).movePointLeft(DECIMAL_PLACES)
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
    return this.amount < CoreTicketProperties.ROUNDING;
  }
}
