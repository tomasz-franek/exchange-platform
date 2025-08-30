package org.exchange.app.backend.common.serializers;

import org.exchange.app.backend.common.ObjectCompareTest;
import org.exchange.app.backend.common.builders.CoreTicket;
import org.exchange.app.backend.common.deserializers.CoreTicketDeserializer;
import org.junit.jupiter.api.Test;

class CoreTicketSerializerTest {

	private final CoreTicketDeserializer deserializer = new CoreTicketDeserializer();
	private final CoreTicketSerializer serializer = new CoreTicketSerializer();

	@Test
  void deserializeCompact_should_deserializeByteArray_when_correctCoreTicket() {
		for (int i = 0; i < 10000; i++) {
      CoreTicket coreTicket = ObjectCompareTest.generateRandomCoreTicket();

			CoreTicket resultTicket = deserializer.deserializeCompact(
					serializer.serializeCompact(coreTicket));

      ObjectCompareTest.validateCoreTicket(resultTicket, resultTicket);
		}
	}
}