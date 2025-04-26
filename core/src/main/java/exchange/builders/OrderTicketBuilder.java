package exchange.builders;


import exchange.app.api.model.Direction;
import exchange.app.api.model.OrderTicket;
import exchange.app.api.model.Pair;
import exchange.utils.CurrencyUtils;
import lombok.Getter;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.ZoneOffset;

@Getter
public class OrderTicketBuilder {

    protected Long id;
    protected LocalDateTime ticketDateUTC = LocalDateTime.now(ZoneOffset.UTC);
    protected Pair pair;
    protected BigDecimal ratio;
    protected BigDecimal valueAmount;
    protected Direction direction;
    protected Long idUser = null;
    protected boolean flagCancelled = false;
    protected boolean flagSaved = false;
    protected boolean finishOrder = false;

    public OrderTicketBuilder() {

    }


    public OrderTicket build() {

        return new OrderTicket(this.id, this.idUser, this.pair, this.direction, this.ticketDateUTC, this.ratio,
                this.valueAmount, false, CurrencyUtils.pairToCurrency(this.pair, this.direction), false, false);
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

    public OrderTicketBuilder withRatio(BigDecimal ratio) {

        this.ratio = ratio;
        return this;
    }

    public OrderTicketBuilder withRatio(String ratio) {

        this.ratio = new BigDecimal(ratio);
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

    public OrderTicketBuilder withValueAmount(BigDecimal valueAmount) {

        this.valueAmount = valueAmount;
        return this;
    }

    public OrderTicketBuilder withValueAmount(String valueAmount) {

        this.valueAmount = new BigDecimal(valueAmount);
        return this;
    }

    public OrderTicketBuilder withTicketDateUTC(LocalDateTime ticketDateUTC) {

        this.ticketDateUTC = ticketDateUTC;
        return this;
    }

}
