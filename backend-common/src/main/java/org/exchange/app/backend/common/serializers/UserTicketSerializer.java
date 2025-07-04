package org.exchange.app.backend.common.serializers;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.extern.log4j.Log4j2;
import org.apache.kafka.common.serialization.Serializer;
import org.exchange.app.common.api.model.UserTicket;

@Log4j2
public class UserTicketSerializer implements Serializer<UserTicket> {

  private final ObjectMapper objectMapper = new ObjectMapper();


  @Override
  public byte[] serialize(String topic, UserTicket data) {
    try {
      byte[] bytes = objectMapper.writeValueAsBytes(data);
      log.info(bytes);
      return bytes;
    } catch (JsonProcessingException e) {
      throw new RuntimeException("Error serializing UserTicket", e);
    }
  }
}