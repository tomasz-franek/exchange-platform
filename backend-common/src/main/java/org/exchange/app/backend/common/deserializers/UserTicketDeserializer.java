package org.exchange.app.backend.common.deserializers;

import static java.util.Arrays.copyOfRange;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.apache.kafka.common.serialization.Deserializer;
import org.exchange.app.backend.common.serializers.UserTicketSerializer;
import org.exchange.app.backend.common.utils.DirectionUtils;
import org.exchange.app.backend.common.utils.EventTypeUtils;
import org.exchange.app.backend.common.utils.IntegerUtils;
import org.exchange.app.backend.common.utils.LongUtils;
import org.exchange.app.backend.common.utils.PairUtils;
import org.exchange.app.backend.common.utils.UUIDUtils;
import org.exchange.app.backend.common.utils.UserTicketStatusUtils;
import org.exchange.app.common.api.model.UserTicket;

public class UserTicketDeserializer implements Deserializer<UserTicket> {

  private final ObjectMapper objectMapper = new ObjectMapper();
  private final LongUtils longUtils = new LongUtils();
  private final UUIDUtils uuidUtils = new UUIDUtils();
  private final PairUtils pairUtils = new PairUtils();
  private final DirectionUtils directionUtils = new DirectionUtils();
  private final EventTypeUtils eventTypeUtils = new EventTypeUtils();
  private final UserTicketStatusUtils userTicketStatusUtils = new UserTicketStatusUtils();
  private final IntegerUtils integerUtils = new IntegerUtils();

  @Override
  public UserTicket deserialize(String topic, byte[] data) {
    return this.deserializeStandard(data);
  }

  public UserTicket deserializeStandard(byte[] data) {
    try {
      return objectMapper.readValue(data, UserTicket.class);
    } catch (Exception e) {
      throw new RuntimeException("Error deserializing UserTicket", e);
    }
  }

  public UserTicket deserializeCompact(byte[] data) {
    if (data == null || data.length != UserTicketSerializer.BYTE_ARRAY_SIZE) {
      throw new RuntimeException("Error deserializing UserTicket");
    }
    UserTicket userTicket = new UserTicket();
    int position = 0;
    userTicket.setId(longUtils.toObject(copyOfRange(data, position, longUtils.getSize())));
    position += longUtils.getSize();
    userTicket.setAmount(
        longUtils.toObject(copyOfRange(data, position, position + longUtils.getSize())));
    position += longUtils.getSize();
    userTicket.setRatio(
        longUtils.toObject(copyOfRange(data, position, position + longUtils.getSize())));
    position += longUtils.getSize();
    userTicket.setUserId(
        uuidUtils.toObject(copyOfRange(data, position, position + uuidUtils.getSize())));
    position += uuidUtils.getSize();
    userTicket.setUserAccountId(
        uuidUtils.toObject(copyOfRange(data, position, position + uuidUtils.getSize())));
    position += uuidUtils.getSize();
    userTicket.setPair(
        pairUtils.toObject(copyOfRange(data, position, position + pairUtils.getSize())));
    position += pairUtils.getSize();
    userTicket.setEpochUtc(
        longUtils.toObject(copyOfRange(data, position, position + longUtils.getSize())));
    position += longUtils.getSize();
    userTicket.setDirection(
        directionUtils.toObject(copyOfRange(data, position, position + directionUtils.getSize())));
    position += directionUtils.getSize();
    userTicket.setEventType(
        eventTypeUtils.toObject(copyOfRange(data, position, position + eventTypeUtils.getSize())));
    position += eventTypeUtils.getSize();
    userTicket.setTicketStatus(userTicketStatusUtils.toObject(
        copyOfRange(data, position, position + userTicketStatusUtils.getSize())));
    position += userTicketStatusUtils.getSize();
    userTicket.setUpdatedDateUtc(
        longUtils.toObject(copyOfRange(data, position, position + longUtils.getSize())));
    position += longUtils.getSize();
    userTicket.setVersion(
        integerUtils.toObject(copyOfRange(data, position, position + integerUtils.getSize())));
    return userTicket;
  }
}