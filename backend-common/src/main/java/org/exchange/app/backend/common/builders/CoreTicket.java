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
	private long epochUtc;

  public CoreTicket(@NotNull Long id, @NotNull long amount, @NotNull long ratio,
			@NotNull long epochUtc, final @NotNull UUID userId) {
    assert id != null;
    assert id > 0;
    assert amount >= 0;
    assert ratio > 0;
		assert epochUtc > 0;
    assert userId != null;
    this.id = id;
    this.amount = amount;
    this.ratio = ratio;
		this.epochUtc = epochUtc;
    this.userId = userId;
  }

  public CoreTicket(@NotNull Long id, @NotNull long amount, @NotNull long ratio,
			@NotNull long epochUtc, @NotNull UUID userId,
      @NotNull Pair pair, @NotNull Direction direction) {
		this(id, amount, ratio, epochUtc, userId);
    assert pair != null;
    assert direction != null;
    this.pair = pair;
    this.direction = direction;
  }

	public CoreTicket newAmount(long amount, long epochUtc) {
		return newAmount(amount, epochUtc, this.id);
  }

	public CoreTicket newAmount(long newAmount, long epochUtc, long coreTicketId)
      throws ArithmeticException {
    assert newAmount >= 0;
		assert epochUtc > 0;
    assert coreTicketId > 0;
    if (this.amount >= newAmount) {
			return new CoreTicket(coreTicketId, newAmount, this.ratio, epochUtc, this.userId, this.pair,
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
        epochUtc == that.epochUtc &&
        Objects.equals(userId, that.userId) &&
        pair == that.pair &&
        direction == that.direction;
  }

  @Override
  public int hashCode() {
    return Objects.hash(id, amount, ratio, userId, pair, direction, epochUtc);
  }
}
