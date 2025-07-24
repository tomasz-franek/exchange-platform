package org.exchange.app.backend.db.utils;

import static org.assertj.core.api.Assertions.assertThat;

import java.util.UUID;
import org.exchange.app.backend.db.entities.ExchangeEventSourceEntity;
import org.exchange.app.common.api.model.EventType;
import org.junit.jupiter.api.Test;

class ChecksumUtilTest {

  @Test
  void checksum_should_generate_correctValue_when_calledWithExchangeEventSourceEntityObject() {
    ExchangeEventSourceEntity exchangeEventSourceEntity = new ExchangeEventSourceEntity();
    exchangeEventSourceEntity.setAmount(400000L);
    exchangeEventSourceEntity.setUserAccountId(
        UUID.fromString("72aa8932-8798-4d1b-aaf0-590a3e6ffa22"));
    exchangeEventSourceEntity.setEventType(EventType.DEPOSIT);
    assertThat(ChecksumUtil.checksum(exchangeEventSourceEntity)).isEqualTo(-7257293078692491091L);

    exchangeEventSourceEntity = new ExchangeEventSourceEntity();
    exchangeEventSourceEntity.setAmount(370000L);
    exchangeEventSourceEntity.setUserAccountId(
        UUID.fromString("72aa8932-8798-4d1b-aaf0-590a3e6ffa55"));
    exchangeEventSourceEntity.setEventType(EventType.DEPOSIT);
    assertThat(ChecksumUtil.checksum(exchangeEventSourceEntity)).isEqualTo(-6061119825215796120L);

    exchangeEventSourceEntity = new ExchangeEventSourceEntity();
    exchangeEventSourceEntity.setAmount(100000L);
    exchangeEventSourceEntity.setUserAccountId(
        UUID.fromString("72aa8932-8798-4d1b-aaf0-590a3e6ffa11"));
    exchangeEventSourceEntity.setEventType(EventType.DEPOSIT);
    assertThat(ChecksumUtil.checksum(exchangeEventSourceEntity)).isEqualTo(-6123996541066948108L);
  }
}