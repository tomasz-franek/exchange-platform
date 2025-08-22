package org.exchange.app.backend.common.serializers;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.extern.log4j.Log4j2;
import org.apache.kafka.common.serialization.Serializer;
import org.exchange.app.backend.common.utils.DirectionUtils;
import org.exchange.app.backend.common.utils.EventTypeUtils;
import org.exchange.app.backend.common.utils.IntegerUtils;
import org.exchange.app.backend.common.utils.LongUtils;
import org.exchange.app.backend.common.utils.UUIDUtils;
import org.exchange.app.backend.common.utils.UserTicketStatusUtils;
import org.exchange.app.common.api.model.UserTicket;

@Log4j2
public class UserTicketSerializer implements Serializer<UserTicket> {

  private final ObjectMapper objectMapper = new ObjectMapper();
  public final static byte BYTE_ARRAY_SIZE = 88;


  @Override
  public byte[] serialize(String topic, UserTicket data) {
    return this.serializeStandard(data);
  }

  public byte[] serializeStandard(UserTicket data) {
    try {
      return objectMapper.writeValueAsBytes(data);
    } catch (JsonProcessingException e) {
      throw new RuntimeException("Error serializing UserTicket", e);
    }
  }

  public byte[] serializeCompact(UserTicket data) {
    byte[] out = new byte[BYTE_ARRAY_SIZE];
    byte[] current;
    int position = 0;
    current = LongUtils.longToByteArray(data.getId());
    int currentSizeBytes = 9;
    System.arraycopy(current, 0, out, position, currentSizeBytes);
    position += currentSizeBytes;
    current = LongUtils.longToByteArray(data.getAmount());
    System.arraycopy(current, 0, out, position, currentSizeBytes);
    position += currentSizeBytes;
    current = LongUtils.longToByteArray(data.getRatio());
    System.arraycopy(current, 0, out, position, currentSizeBytes);
    position += currentSizeBytes;
    current = UUIDUtils.uuidToByteArray(data.getUserId());
    currentSizeBytes = 17;
    System.arraycopy(current, 0, out, position, currentSizeBytes);
    position += currentSizeBytes;
    current = UUIDUtils.uuidToByteArray(data.getUserAccountId());
    System.arraycopy(current, 0, out, position, currentSizeBytes);
    position += currentSizeBytes;
    current = new PairSerializer().serialize("", data.getPair());
    currentSizeBytes = 1;
    System.arraycopy(current, 0, out, position, currentSizeBytes);
    position += currentSizeBytes;
    current = LongUtils.longToByteArray(data.getEpochUtc());
    currentSizeBytes = 9;
    System.arraycopy(current, 0, out, position, currentSizeBytes);
    position += currentSizeBytes;
    current = DirectionUtils.directionToByteArray(data.getDirection());
    currentSizeBytes = 1;
    System.arraycopy(current, 0, out, position, currentSizeBytes);
    position += currentSizeBytes;
    current = EventTypeUtils.eventTypeToByteArray(data.getEventType());
    System.arraycopy(current, 0, out, position, currentSizeBytes);
    position += currentSizeBytes;
    current = UserTicketStatusUtils.userTicketStatusToByteArray(data.getTicketStatus());
    System.arraycopy(current, 0, out, position, currentSizeBytes);
    position += currentSizeBytes;
    current = LongUtils.longToByteArray(data.getUpdatedDateUtc());
    currentSizeBytes = 9;
    System.arraycopy(current, 0, out, position, currentSizeBytes);
    position += currentSizeBytes;
    current = IntegerUtils.integerToByteArray(data.getVersion());
    currentSizeBytes = 5;
    System.arraycopy(current, 0, out, position, currentSizeBytes);
    return out;
  }
}