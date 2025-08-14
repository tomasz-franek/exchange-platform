package org.exchange.app.backend.common.deserializers;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.apache.kafka.common.serialization.Deserializer;
import org.exchange.app.backend.common.builders.CoreTicket;

public class CoreTicketDeserializer implements Deserializer<CoreTicket> {

  private final ObjectMapper objectMapper = new ObjectMapper();

  @Override
  public CoreTicket deserialize(String topic, byte[] data) {
    return this.deserializeStandard(data);
  }

  private CoreTicket deserializeStandard(byte[] data) {
    try {
      return objectMapper.readValue(data, CoreTicket.class);
    } catch (Exception e) {
      throw new RuntimeException("Error deserializing CoreTicket", e);
    }
  }
}
