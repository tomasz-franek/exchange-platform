package org.exchange.app.backend.common.deserializers;

import org.exchange.app.backend.common.ObjectUtilsTest;
import org.exchange.app.backend.common.builders.CoreTicket;
import org.exchange.app.backend.common.serializers.CoreTicketSerializer;
import org.junit.jupiter.api.Test;

public class CoreTicketDeserializerTest {

  private final CoreTicketDeserializer deserializer = new CoreTicketDeserializer();
  private final CoreTicketSerializer serializer = new CoreTicketSerializer();

  @Test
  void deserializeCompact_should_deserializeByteArray_when_correctCoreTicket() {
    for (int i = 0; i < 10000; i++) {
      CoreTicket coreTicket = ObjectUtilsTest.generateRandomCoreTicket();

      CoreTicket resultTicket = deserializer.deserializeCompact(
          serializer.serializeCompact(coreTicket));

      ObjectUtilsTest.validateCoreTicket(resultTicket, resultTicket);
    }
  }

  @Test
  void deserializeStandard_should_deserializeByteArray_when_correctCoreTicket() {
    for (int i = 0; i < 10000; i++) {
      CoreTicket coreTicket = ObjectUtilsTest.generateRandomCoreTicket();

      CoreTicket resultTicket = deserializer.deserializeStandard(
          serializer.serializeStandard(coreTicket));

      ObjectUtilsTest.validateCoreTicket(resultTicket, resultTicket);
    }
  }

  @Test
  void deserializeCompact_should_deserializeCorrectObject_when_coreTicketFieldsAreNulls() {
    CoreTicket coreTicket = new CoreTicket();

    CoreTicket resultTicket = deserializer.deserializeCompact(
        serializer.serializeCompact(coreTicket));

    ObjectUtilsTest.validateCoreTicket(resultTicket, resultTicket);
  }

  @Test
  void deserializeStandard_should_deserializeCorrectObject_when_coreTicketFieldsAreNulls() {
    CoreTicket coreTicket = new CoreTicket();

    CoreTicket resultTicket = deserializer.deserializeStandard(
        serializer.serializeStandard(coreTicket));

    ObjectUtilsTest.validateCoreTicket(resultTicket, resultTicket);
  }
}
