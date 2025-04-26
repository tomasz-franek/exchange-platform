package exchange.utils;

import exchange.app.api.model.Direction;
import exchange.app.api.model.Pair;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertEquals;

class CurrencyUtilsTest {
    @Test
    public final void testSplitPair() {
        for (Pair object : Pair.values()) {
            assertEquals(object.toString(),
                    CurrencyUtils.pairToCurrency(object, Direction.SELL) + "_" + CurrencyUtils.pairToCurrency(object,
                            Direction.BUY));
        }
    }
}