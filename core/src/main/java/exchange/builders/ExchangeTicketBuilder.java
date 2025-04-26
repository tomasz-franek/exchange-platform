package exchange.builders;


import exchange.app.api.model.Direction;
import exchange.app.api.model.ExchangeTicket;
import exchange.app.api.model.Pair;
import exchange.utils.CurrencyUtils;
import lombok.Getter;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Getter
public class ExchangeTicketBuilder extends OrderTicketBuilder {

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

    public ExchangeTicketBuilder withRatio(BigDecimal ratio) {

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

    public ExchangeTicketBuilder withValueAmount(BigDecimal valueAmount) {

        super.withValueAmount(valueAmount);
        return this;
    }

    public ExchangeTicketBuilder withValueAmount(String valueAmount) {

        super.withValueAmount(valueAmount);
        return this;
    }

    public ExchangeTicketBuilder withTicketDateUTC(LocalDateTime ticketDate) {

        super.withTicketDateUTC(ticketDate);
        return this;
    }

    public ExchangeTicket buildExchangeTicket() {

        return new ExchangeTicket(this.id, idUser, pair, direction, ticketDateUTC, ratio, valueAmount, false,
                CurrencyUtils.pairToCurrency(pair, direction), false, false);
    }

    public static ExchangeTicketBuilder createBuilder() {

        return new ExchangeTicketBuilder();
    }
}
