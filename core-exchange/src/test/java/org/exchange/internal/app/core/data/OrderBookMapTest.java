package org.exchange.internal.app.core.data;

import static org.assertj.core.api.Assertions.assertThat;

import java.util.SortedMap;
import java.util.TreeMap;
import org.exchange.app.common.api.model.Pair;
import org.junit.jupiter.api.Test;

class OrderBookMapTest {

	private final OrderBookMap orderBookMap = new OrderBookMap(Pair.EUR_GBP);
	@Test
	void makeDifference_should_returnEmptyString_when_allMapsAreEmpty() {
		String result = orderBookMap.makeDifference(new TreeMap<>(), new TreeMap<>());
		assertThat(result).isEqualTo("");
	}

	@Test
	void makeDifference_should_returnEmptyString_when_previousStateIsNull() {
		String result = orderBookMap.makeDifference(null, new TreeMap<>());
		assertThat(result).isEqualTo("");
	}

	@Test
	void makeDifference_should_returnEmptyString_when_currentStateIsNull() {
		String result = orderBookMap.makeDifference(new TreeMap<>(), null);
		assertThat(result).isEqualTo("");
	}

	@Test
	void makeDifference_should_returnEmptyString_when_StatesAreEqual() {
		SortedMap<Long,Long> previousState = new TreeMap<>();
		previousState.put(1L,1L);
		SortedMap<Long,Long> currentState = new TreeMap<>();
		currentState.put(1L,1L);

		String result = orderBookMap.makeDifference(previousState, currentState);
		assertThat(result).isEqualTo("");
	}

	@Test
	void makeDifference_should_returnStringWithDifferenceNegativeAmount_when_elementMissingInCurrentState() {
		SortedMap<Long,Long> previousState = new TreeMap<>();
		previousState.put(1L,1L);
		previousState.put(2L,2L);
		SortedMap<Long,Long> currentState = new TreeMap<>();
		currentState.put(1L,1L);

		String result = orderBookMap.makeDifference(previousState, currentState);
		assertThat(result).isEqualTo("""
				{"ratio":2,"amount":-2}
				""".trim());
	}

	@Test
	void makeDifference_should_returnStringWithDifferencePositiveAmount_when_elementAddedToCurrentState() {
		SortedMap<Long,Long> previousState = new TreeMap<>();
		previousState.put(1L,1L);
		SortedMap<Long,Long> currentState = new TreeMap<>();
		currentState.put(1L,1L);
		currentState.put(2L,2L);

		String result = orderBookMap.makeDifference(previousState, currentState);
		assertThat(result).isEqualTo("""
				{"ratio":2,"amount":2}
				""".trim());
	}

	@Test
	void makeDifference_should_returnStringWithDifferenceNegativeAmount_when_currentStateReduced() {
		SortedMap<Long,Long> previousState = new TreeMap<>();
		previousState.put(1L,10L);
		SortedMap<Long,Long> currentState = new TreeMap<>();
		currentState.put(1L,1L);

		String result = orderBookMap.makeDifference(previousState, currentState);
		assertThat(result).isEqualTo("""
				{"ratio":1,"amount":-9}
				""".trim());
	}

	@Test
	void makeDifference_should_returnStringWithDifferencePositiveAmount_when_currentStateAdded() {
		SortedMap<Long,Long> previousState = new TreeMap<>();
		previousState.put(1L,1L);
		SortedMap<Long,Long> currentState = new TreeMap<>();
		currentState.put(1L,10L);

		String result = orderBookMap.makeDifference(previousState, currentState);
		assertThat(result).isEqualTo("""
				{"ratio":1,"amount":9}
				""".trim());
	}

	@Test
	void makeDifference_should_returnStringWithComaSeparatedDifferenceElements_when_moreThanOneElementChanged() {
		SortedMap<Long,Long> previousState = new TreeMap<>();
		previousState.put(1L,1L);
		previousState.put(2L,1L);
		SortedMap<Long,Long> currentState = new TreeMap<>();
		currentState.put(1L,10L);
		currentState.put(2L,10L);

		String result = orderBookMap.makeDifference(previousState, currentState);
		assertThat(result).isEqualTo("""
				{"ratio":1,"amount":9},{"ratio":2,"amount":9}
				""".trim());
	}

}