package org.exchange.app.backend.common.config;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.apache.kafka.common.serialization.Deserializer;
import org.exchange.app.common.api.model.UserTicket;

public class UserTicketDeserializer implements Deserializer<UserTicket> {

  private final ObjectMapper objectMapper = new ObjectMapper();

  @Override
  public UserTicket deserialize(String topic, byte[] data) {
    try {
      return objectMapper.readValue(data, UserTicket.class);
    } catch (Exception e) {
      throw new RuntimeException("Error deserializing UserTicket", e);
    }
  }
}