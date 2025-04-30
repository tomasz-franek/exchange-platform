package exchange.stategies;

import exchange.builders.CoreTicket;
import jakarta.validation.constraints.NotNull;

public interface RatioStrategy {

  long getRatio(final @NotNull CoreTicket orderTicket, final @NotNull CoreTicket oppositeTicket);
}
