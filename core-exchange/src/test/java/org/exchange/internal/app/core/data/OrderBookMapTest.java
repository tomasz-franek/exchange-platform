package org.exchange.internal.app.core.data;

import static org.assertj.core.api.Assertions.assertThat;

import java.util.List;
import java.util.SortedMap;
import java.util.TreeMap;
import org.exchange.app.common.api.model.OrderBookRow;
import org.exchange.app.common.api.model.Pair;
import org.junit.jupiter.api.Test;

class OrderBookMapTest {

  private final OrderBookMap orderBookMap = new OrderBookMap(Pair.EUR_GBP);

  @Test
  void differenceOfOrderBooks_should_returnEmptyString_when_allMapsAreEmpty() {
    List<OrderBookRow> result = orderBookMap.differenceOfOrderBooks(new TreeMap<>(),
        new TreeMap<>());
    assertThat(result.size()).isEqualTo(0);
  }

  @Test
  void differenceOfOrderBooks_should_returnEmptyString_when_previousStateIsNull() {
    List<OrderBookRow> result = orderBookMap.differenceOfOrderBooks(null, new TreeMap<>());
    assertThat(result.size()).isEqualTo(0);
  }

  @Test
  void differenceOfOrderBooks_should_returnEmptyString_when_currentStateIsNull() {
    List<OrderBookRow> result = orderBookMap.differenceOfOrderBooks(new TreeMap<>(), null);
    assertThat(result.size()).isEqualTo(0);
  }

  @Test
  void differenceOfOrderBooks_should_returnEmptyString_when_StatesAreEqual() {
    SortedMap<Long, Long> previousState = new TreeMap<>();
    previousState.put(1L, 1L);
    SortedMap<Long, Long> currentState = new TreeMap<>();
    currentState.put(1L, 1L);

    List<OrderBookRow> result = orderBookMap.differenceOfOrderBooks(previousState, currentState);
    assertThat(result.size()).isEqualTo(0);
  }

  @Test
  void differenceOfOrderBooks_should_returnStringWithDifferenceNegativeAmount_when_elementMissingInCurrentState() {
    SortedMap<Long, Long> previousState = new TreeMap<>();
    previousState.put(1L, 1L);
    previousState.put(2L, 2L);
    SortedMap<Long, Long> currentState = new TreeMap<>();
    currentState.put(1L, 1L);

    List<OrderBookRow> result = orderBookMap.differenceOfOrderBooks(previousState, currentState);
    assertThat(result.getFirst().getR()).isEqualTo(2);
    assertThat(result.getFirst().getA()).isEqualTo(-2);
  }

  @Test
  void differenceOfOrderBooks_should_returnStringWithDifferencePositiveAmount_when_elementAddedToCurrentState() {
    SortedMap<Long, Long> previousState = new TreeMap<>();
    previousState.put(1L, 1L);
    SortedMap<Long, Long> currentState = new TreeMap<>();
    currentState.put(1L, 1L);
    currentState.put(2L, 2L);

    List<OrderBookRow> result = orderBookMap.differenceOfOrderBooks(previousState, currentState);
    assertThat(result.getFirst().getR()).isEqualTo(2);
    assertThat(result.getFirst().getA()).isEqualTo(2);
  }

  @Test
  void differenceOfOrderBooks_should_returnStringWithDifferenceNegativeAmount_when_currentStateReduced() {
    SortedMap<Long, Long> previousState = new TreeMap<>();
    previousState.put(1L, 10L);
    SortedMap<Long, Long> currentState = new TreeMap<>();
    currentState.put(1L, 1L);

    List<OrderBookRow> result = orderBookMap.differenceOfOrderBooks(previousState, currentState);
    assertThat(result.getFirst().getR()).isEqualTo(1);
    assertThat(result.getFirst().getA()).isEqualTo(-9);
  }

  @Test
  void differenceOfOrderBooks_should_returnStringWithDifferencePositiveAmount_when_currentStateAdded() {
    SortedMap<Long, Long> previousState = new TreeMap<>();
    previousState.put(1L, 1L);
    SortedMap<Long, Long> currentState = new TreeMap<>();
    currentState.put(1L, 10L);

    List<OrderBookRow> result = orderBookMap.differenceOfOrderBooks(previousState, currentState);
    assertThat(result.getFirst().getR()).isEqualTo(1);
    assertThat(result.getFirst().getA()).isEqualTo(9);
  }

  @Test
  void differenceOfOrderBooks_should_returnStringWithComaSeparatedDifferenceElements_when_moreThanOneElementChanged() {
    SortedMap<Long, Long> previousState = new TreeMap<>();
    previousState.put(1L, 1L);
    previousState.put(2L, 1L);
    SortedMap<Long, Long> currentState = new TreeMap<>();
    currentState.put(1L, 10L);
    currentState.put(2L, 10L);

    List<OrderBookRow> result = orderBookMap.differenceOfOrderBooks(previousState, currentState);
    assertThat(result.getFirst().getR()).isEqualTo(1);
    assertThat(result.getFirst().getA()).isEqualTo(9);
    assertThat(result.get(1).getR()).isEqualTo(2);
    assertThat(result.get(1).getA()).isEqualTo(9);
  }

}