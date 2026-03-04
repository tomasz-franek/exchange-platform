package org.exchange.app.backend.common.builders;

import static org.exchange.app.backend.common.builders.CoreTicketProperties.DECIMAL_PLACES;

import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.Objects;
import java.util.UUID;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.exchange.app.backend.common.utils.CurrencyUtils;
import org.exchange.app.common.api.model.Direction;
import org.exchange.app.common.api.model.Pair;

@Getter
@Setter
@NoArgsConstructor
public class CoreTicket {

  private long id;
  private long amount;
  private long ratio;
  private UUID userId;
  private Pair pair;
  private Direction direction;

  public CoreTicket(@NotNull Long id, @NotNull long amount, @NotNull long ratio,
      @NotNull final @NotNull UUID userId) {
    if (id == null) {
      throw new IllegalArgumentException("Id is null");
    }
    if (userId == null) {
      throw new IllegalArgumentException("UserId is null");
    }
    if (id <= 0) {
      throw new IllegalArgumentException("Wrong Id: " + id);
    }
    if (ratio <= 0) {
      throw new IllegalArgumentException("Wrong Ratio: " + ratio);
    }
    if (amount < 0) {
      throw new IllegalArgumentException("Wrong Amount: " + amount);
    }
    this.id = id;
    this.amount = amount;
    this.ratio = ratio;
    this.userId = userId;
  }

  public CoreTicket(@NotNull Long id, @NotNull long amount, @NotNull long ratio,
      @NotNull UUID userId, @NotNull Pair pair, @NotNull Direction direction) {
    this(id, amount, ratio, userId);
    if (pair == null) {
      throw new IllegalArgumentException("Pair is null");
    }
    if (direction == null) {
      throw new IllegalArgumentException("Direction is null");
    }
    this.pair = pair;
    this.direction = direction;
  }

  public CoreTicket newAmount(long amount) {
    return newAmount(amount, this.id);
  }

  public CoreTicket newAmount(long newAmount, long coreTicketId)
      throws ArithmeticException {
    if (newAmount < 0) {
      throw new IllegalArgumentException("Invalid new Amount: " + newAmount);
    }
    if (coreTicketId < 0) {
      throw new IllegalArgumentException("Invalid coreTicketId: " + coreTicketId);
    }
    if (this.amount >= newAmount) {
      return new CoreTicket(coreTicketId, newAmount, this.ratio, this.userId, this.pair,
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
    return String.format("amount : '%s' %s ratio : '%s'", this.getFinancialValue(),
        CurrencyUtils.pairToCurrency(this), this.getRatioValue());
  }

  public String getIdCurrency() {
    return CurrencyUtils.pairToCurrency(this);
  }

  public boolean isFinishOrder() {
    return this.amount < CoreTicketProperties.ROUNDING;
  }

  @Override
  public boolean equals(Object o) {
    if (!(o instanceof CoreTicket that)) {
      return false;
    }
    return id == that.id &&
        amount == that.amount &&
        ratio == that.ratio &&
        Objects.equals(userId, that.userId) &&
        pair == that.pair &&
        direction == that.direction;
  }

  @Override
  public int hashCode() {
    return Objects.hash(id, amount, ratio, userId, pair, direction);
  }
}
