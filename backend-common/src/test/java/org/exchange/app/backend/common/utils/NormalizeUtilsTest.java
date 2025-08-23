package org.exchange.app.backend.common.utils;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.CsvSource;

class NormalizeUtilsTest {

	@ParameterizedTest
	@CsvSource(value = {
			"0;0.00",
			"1;0.00",
			"10;0.00",
			"100;0.01",
			"1000;0.10",
			"10000;1.00",
			"100000;10.00",
			"1000000;100.00",
			"10000000;1000.00",
			"-1;0.00",
			"-10;0.00",
			"-100;-0.01",
			"-1000;-0.10",
			"-10000;-1.00",
			"-100000;-10.00",
			"-1000000;-100.00",
			"-10000000;-1000.00",
	}, delimiter = ';')
	void normalizeValueToMoney_should_returnCorrectValueRoundedToTwoDigitalPlaces_when_called(
			long value, String result) {
		assertThat(NormalizeUtils.normalizeValueToMoney(value)).isEqualTo(result);
	}

	@ParameterizedTest
	@CsvSource(value = {
			"0;0.0000",
			"1;0.0001",
			"10;0.0010",
			"100;0.0100",
			"1000;0.1000",
			"10000;1.0000",
			"100000;10.0000",
			"1000000;100.0000",
			"10000000;1000.0000",
			"-1;-0.0001",
			"-10;-0.0010",
			"-100;-0.0100",
			"-1000;-0.1000",
			"-10000;-1.0000",
			"-100000;-10.0000",
			"-1000000;-100.0000",
			"-10000000;-1000.0000",
	}, delimiter = ';')
	void normalizeValueToRatio_should_returnCorrectValueRoundedToTwoDigitalPlaces_when_called(
			long value, String result) {
		assertThat(NormalizeUtils.normalizeValueToRatio(value)).isEqualTo(result);
	}
}