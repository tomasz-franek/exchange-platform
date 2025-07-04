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


  @Override
  public byte[] serialize(String topic, UserTicket data) {
    return this.serializeStandard(data);
  }

  private byte[] serializeStandard(UserTicket data) {
    try {
      byte[] bytes = objectMapper.writeValueAsBytes(data);
      log.info(bytes);
      return bytes;
    } catch (JsonProcessingException e) {
      throw new RuntimeException("Error serializing UserTicket", e);
    }
  }

  public byte[] serializeCompact(UserTicket data) {
    byte[] out = new byte[42];
    byte[] current = LongUtils.longToByteArray(data.getId());
    int position = 0;
    int currentSizeBytes = 8;
    System.arraycopy(out, position, current, 0, currentSizeBytes);
    position += currentSizeBytes;
    current = LongUtils.longToByteArray(data.getAmount());
    System.arraycopy(out, position, current, 0, currentSizeBytes);
    position += currentSizeBytes;
    current = LongUtils.longToByteArray(data.getRatio());
    System.arraycopy(out, position, current, 0, currentSizeBytes);
    position += currentSizeBytes;
    current = UUIDUtils.uuidToByteArray(data.getUserId());
    currentSizeBytes = 16;
    System.arraycopy(out, position, current, 0, currentSizeBytes);
    position += currentSizeBytes;
    current = UUIDUtils.uuidToByteArray(data.getUserAccountId());
    System.arraycopy(out, position, current, 0, currentSizeBytes);
    position += currentSizeBytes;
    current = new PairSerializer().serialize("", data.getPair());
    currentSizeBytes = 1;
    System.arraycopy(out, position, current, 0, currentSizeBytes);
    position += currentSizeBytes;
    current = LongUtils.longToByteArray(data.getEpochUTC());
    currentSizeBytes = 4;
    System.arraycopy(out, position, current, 0, currentSizeBytes);
    position += currentSizeBytes;
    current = DirectionUtils.directionToByteArray(data.getDirection());
    currentSizeBytes = 1;
    System.arraycopy(out, position, current, 0, currentSizeBytes);
    position += currentSizeBytes;
    current = EventTypeUtils.eventTypeToByteArray(data.getEventType());
    System.arraycopy(out, position, current, 0, currentSizeBytes);
    position += currentSizeBytes;
    current = UserTicketStatusUtils.userTicketStatusToByteArray(data.getTicketStatus());
    System.arraycopy(out, position, current, 0, currentSizeBytes);
    position += currentSizeBytes;
    current = LongUtils.longToByteArray(data.getUpdatedDateUTC());
    currentSizeBytes = 4;
    System.arraycopy(out, position, current, 0, currentSizeBytes);
    position += currentSizeBytes;
    current = IntegerUtils.integerToByteArray(data.getVersion());
    currentSizeBytes = 2;
    System.arraycopy(out, position, current, 0, currentSizeBytes);
    return out;
  }
}