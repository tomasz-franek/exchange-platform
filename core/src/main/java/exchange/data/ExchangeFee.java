package exchange.data;

import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import java.math.BigDecimal;
import java.util.Date;

@Getter
@ToString
public class ExchangeFee {
    private final OrderSummary orderSummary;
    @Setter
    private BigDecimal feeValue;
    @Setter
    private Date feeTime;
    private final BigDecimal feeDefinition;

    public ExchangeFee(final @NotNull OrderSummary orderSummary, final @NotNull BigDecimal feeDefinition) {
        this.orderSummary = orderSummary;
        this.feeDefinition = feeDefinition;
    }
}
