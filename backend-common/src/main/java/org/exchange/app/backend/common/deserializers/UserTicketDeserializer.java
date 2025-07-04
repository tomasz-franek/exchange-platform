package org.exchange.app.backend.common.deserializers;

import static java.util.Arrays.copyOfRange;
import static org.exchange.app.backend.common.utils.LongUtils.byteArrayToLong;
import static org.exchange.app.backend.common.utils.UUIDUtils.byteArrayToUUID;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.apache.kafka.common.serialization.Deserializer;
import org.exchange.app.backend.common.utils.DirectionUtils;
import org.exchange.app.backend.common.utils.EventTypeUtils;
import org.exchange.app.backend.common.utils.IntegerUtils;
import org.exchange.app.backend.common.utils.UserTicketStatusUtils;
import org.exchange.app.common.api.model.UserTicket;

public class UserTicketDeserializer implements Deserializer<UserTicket> {

  private final ObjectMapper objectMapper = new ObjectMapper();

  @Override
  public UserTicket deserialize(String topic, byte[] data) {
    return this.deserializeStandard(data);
  }

  private UserTicket deserializeStandard(byte[] data) {
    try {
      return objectMapper.readValue(data, UserTicket.class);
    } catch (Exception e) {
      throw new RuntimeException("Error deserializing UserTicket", e);
    }
  }

  public UserTicket deserializeCompact(byte[] data) {
    UserTicket userTicket = new UserTicket();
    int position = 0;
    int size = 8;
    userTicket.setId(byteArrayToLong(copyOfRange(data, position, size)));
    position += size;
    userTicket.setAmount(byteArrayToLong(copyOfRange(data, position, position + size)));
    position += size;
    userTicket.setRatio(byteArrayToLong(copyOfRange(data, position, position + size)));
    position += size;
    size = 16;
    userTicket.setUserId(byteArrayToUUID(copyOfRange(data, position, position + size)));
    position += size;
    userTicket.setUserAccountId(byteArrayToUUID(copyOfRange(data, position, position + size)));
    position += size;
    size = 1;
    userTicket.setPair(
        new PairDeserializer().deserialize("", copyOfRange(data, position, position + size)));
    position += size;
    size = 8;
    userTicket.setEpochUTC(byteArrayToLong(copyOfRange(data, position, position + size)));
    position += size;
    size = 1;
    userTicket.setDirection(
        DirectionUtils.byteArrayToDirection(copyOfRange(data, position, position + size)));
    position += size;
    userTicket.setEventType(
        EventTypeUtils.byteArrayToEventType(copyOfRange(data, position, position + size)));
    position += size;
    userTicket.setTicketStatus(
        UserTicketStatusUtils.byteArrayToUserTicketStatus(
            copyOfRange(data, position, position + size)));
    position += size;
    size = 8;
    userTicket.setUpdatedDateUTC(byteArrayToLong(copyOfRange(data, position, position + size)));
    position += size;
    size = 4;
    userTicket.setVersion(
        IntegerUtils.byteArrayToInteger(copyOfRange(data, position, position + size)));
    return userTicket;
  }
}