package org.exchange.app.backend.common.serializers;

import static org.assertj.core.api.Assertions.assertThat;
import static org.exchange.app.backend.common.serializers.PairSerializer.NULL_BYTE;

import org.exchange.app.backend.common.ObjectUtilsTest;
import org.exchange.app.backend.common.builders.CoreTicket;
import org.junit.jupiter.api.Test;

class CoreTicketSerializerTest {

  @Test
  void serializeStandard_should_returnCorrectByteArray_when_dataIsExchangeResult() {
    try (CoreTicketSerializer serializer = new CoreTicketSerializer()) {
      byte[] array = serializer.serializeStandard(ObjectUtilsTest.generateRandomCoreTicket());
      assertThat(array.length).isGreaterThan(270);
    }
  }

  @Test
  void serializeCompact_should_returnCorrectByteArray_when_dataIsExchangeResult() {
    try (CoreTicketSerializer serializer = new CoreTicketSerializer()) {
      byte[] array = serializer.serializeCompact(ObjectUtilsTest.generateRandomCoreTicket());
      assertThat(array.length).isEqualTo(47);
    }
  }

  @Test
  void getSize_should_returnCurrentSizeOfByteArray_when_called() {
    assertThat(CoreTicketSerializer.getSize()).isEqualTo(47);
  }

  @Test
  void serializeStandard_should_returnNULL_BYTE_when_CoreTicketIsNull() {
    try (CoreTicketSerializer serializer = new CoreTicketSerializer()) {
      byte[] serializedDate = serializer.serializeStandard(null);

      assertThat(serializedDate.length).isEqualTo(4);
      assertThat(serializedDate).isEqualTo(new byte[]{110, 117, 108, 108});
    }
  }

  @Test
  void serializeStandard_should_returnByteArray_when_CoreTicketFieldsAreNulls() {
    try (CoreTicketSerializer serializer = new CoreTicketSerializer()) {
      byte[] serializedDate = serializer.serializeStandard(new CoreTicket());

      assertThat(serializedDate.length).isEqualTo(149);
    }
  }

  @Test
  void serializeCompact_should_returnByteArray_when_CoreTicketFieldsAreNulls() {
    try (CoreTicketSerializer serializer = new CoreTicketSerializer()) {
      byte[] serializedDate = serializer.serializeCompact(new CoreTicket());

      assertThat(serializedDate.length).isEqualTo(CoreTicketSerializer.getSize());
    }
  }

  @Test
  void serializeCompact_should_returnByteArray_when_CoreTicketIsNull() {
    try (CoreTicketSerializer serializer = new CoreTicketSerializer()) {
      byte[] serializedDate = serializer.serializeCompact(null);

      assertThat(serializedDate[0]).isEqualTo(NULL_BYTE);
    }
  }
}