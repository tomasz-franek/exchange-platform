package org.exchange.app.backend.db.utils;

import static org.assertj.core.api.Assertions.assertThat;

import java.time.LocalDateTime;
import java.util.UUID;
import org.exchange.app.backend.db.entities.ExchangeEventSourceEntity;
import org.exchange.app.common.api.model.EventType;
import org.junit.jupiter.api.Test;

class ChecksumUtilTest {

  public final UUID EXISTING_UUID = UUID.fromString("00000000-0000-0000-0002-000000000001");

  @Test
  void checksum_should_generate_correctValue_when_calledWithExchangeEventSourceEntityObject() {
    LocalDateTime localDateTime = LocalDateTime.of(2025, 7, 21, 14, 17, 52, 100);
    ExchangeEventSourceEntity exchangeEventSourceEntity = new ExchangeEventSourceEntity();
    exchangeEventSourceEntity.setAmount(400000L);
    exchangeEventSourceEntity.setUserAccountId(
        UUID.fromString("72aa8932-8798-4d1b-aaf0-590a3e6ffa22"));
    exchangeEventSourceEntity.setEventType(EventType.DEPOSIT);
    exchangeEventSourceEntity.setCreatedBy(EXISTING_UUID);
    exchangeEventSourceEntity.setCreatedDateUtc(localDateTime);
    assertThat(ChecksumUtil.checksum(exchangeEventSourceEntity)).isEqualTo(8855147189441942025L);

    exchangeEventSourceEntity = new ExchangeEventSourceEntity();
    exchangeEventSourceEntity.setAmount(370000L);
    exchangeEventSourceEntity.setUserAccountId(
        UUID.fromString("72aa8932-8798-4d1b-aaf0-590a3e6ffa55"));
    exchangeEventSourceEntity.setEventType(EventType.DEPOSIT);
    exchangeEventSourceEntity.setCreatedDateUtc(localDateTime);
    assertThat(ChecksumUtil.checksum(exchangeEventSourceEntity)).isEqualTo(1024767996531922046L);

    exchangeEventSourceEntity = new ExchangeEventSourceEntity();
    exchangeEventSourceEntity.setAmount(100000L);
    exchangeEventSourceEntity.setUserAccountId(
        UUID.fromString("72aa8932-8798-4d1b-aaf0-590a3e6ffa11"));
    exchangeEventSourceEntity.setEventType(EventType.DEPOSIT);
    exchangeEventSourceEntity.setCreatedDateUtc(localDateTime);
    assertThat(ChecksumUtil.checksum(exchangeEventSourceEntity)).isEqualTo(-4836447837748363023L);
  }
}