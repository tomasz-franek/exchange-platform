package org.exchange.app.backend.common.utils;

import static org.assertj.core.api.Assertions.assertThat;

import java.time.Clock;
import org.exchange.app.backend.common.CoreTestConfiguration;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest(classes = {CoreTestConfiguration.class})
class ExchangeDateUtilsTest {

  @Autowired
  private Clock clock;


  @Test
  void toEpochUtc_should_returnEpochMilliseconds_when_calledWithLocalDateTime() {
    assertThat(ExchangeDateUtils.toEpochUtc(CoreTestConfiguration.localDateTime)).isEqualTo(
        1756830924L);
  }

  @Test
  void toLocalDateTime_should_convertMillisecondsToDateTimeInUtcTimezone_when_called() {
    assertThat(ExchangeDateUtils.toEpochUtc(CoreTestConfiguration.localDateTime)).isEqualTo(
        clock.instant().getEpochSecond());
  }

  @Test
  void toLocalDateTime_should_convertMillisecondsToLocalDateTimeInUtcTimezone_when_called() {
    assertThat(ExchangeDateUtils.toLocalDateTime(clock.instant().getEpochSecond())).isEqualTo(
        CoreTestConfiguration.localDateTime.withNano(0));
  }

  @Test
  void toStringDateTime_should_convertMillisecondsToStringRepresentation_ISO8601_OfDateTimeInUtcTimezone_when_called() {
    assertThat(ExchangeDateUtils.toStringDateTime(clock.instant().getEpochSecond())).isEqualTo(
        "2025-09-02T16:35:24Z");
  }

  @Test
  void currentLocalDateTimeString_should_returnCurrentDateTimeStringRepresentation_ISO8601InUtcZone_when_called() {
    assertThat(ExchangeDateUtils.currentLocalDateTimeString()).endsWith("Z");
  }
}