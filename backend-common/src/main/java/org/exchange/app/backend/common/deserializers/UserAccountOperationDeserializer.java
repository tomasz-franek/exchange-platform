package org.exchange.app.backend.common.deserializers;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.apache.kafka.common.serialization.Deserializer;
import org.exchange.app.external.api.model.UserAccountOperation;

public class UserAccountOperationDeserializer implements Deserializer<UserAccountOperation> {

  private final ObjectMapper objectMapper = new ObjectMapper();

  @Override
  public UserAccountOperation deserialize(String topic, byte[] data) {
    try {
      return objectMapper.readValue(data, UserAccountOperation.class);
    } catch (Exception e) {
      throw new RuntimeException("Error deserializing UserTicket", e);
    }
  }
}
