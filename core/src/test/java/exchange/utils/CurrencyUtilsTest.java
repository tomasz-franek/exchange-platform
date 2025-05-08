package exchange.utils;

import static exchange.app.common.api.model.Direction.BUY;
import static exchange.app.common.api.model.Direction.SELL;
import static org.assertj.core.api.Assertions.assertThat;

import exchange.app.common.api.model.Pair;
import org.junit.jupiter.api.Test;

class CurrencyUtilsTest {

  @Test
  public final void testSplitPair() {
    for (Pair object : Pair.values()) {
      assertThat(
          CurrencyUtils.pairToCurrency(object, SELL) + "_" + CurrencyUtils.pairToCurrency(
              object,
              BUY)).isEqualTo(object.toString());
    }
  }
}