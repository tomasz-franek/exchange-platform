package org.exchange.app.backend.common.deserializers;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.apache.kafka.common.serialization.Deserializer;
import org.exchange.app.backend.common.serializers.UserTicketSerializer;
import org.exchange.app.backend.common.utils.ByteArrayData;
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
    return this.deserializeCompact(new ByteArrayData(data));
  }

  public UserTicket deserializeCompact(ByteArrayData data) {
    if (data == null ||
        data.bytes == null ||
        data.bytes.length != UserTicketSerializer.getSize()) {
      throw new RuntimeException("Error deserializing UserTicket");
    }
    UserTicket userTicket = new UserTicket();
    userTicket.setId(longUtils.toObject(data));
    userTicket.setAmount(longUtils.toObject(data));
    userTicket.setRatio(longUtils.toObject(data));
    userTicket.setUserId(uuidUtils.toObject(data));
    userTicket.setUserAccountId(uuidUtils.toObject(data));
    userTicket.setPair(pairUtils.toObject(data));
    userTicket.setEpochUtc(longUtils.toObject(data));
    userTicket.setDirection(directionUtils.toObject(data));
    userTicket.setEventType(eventTypeUtils.toObject(data));
    userTicket.setTicketStatus(userTicketStatusUtils.toObject(data));
    userTicket.setUpdatedDateUtc(longUtils.toObject(data));
    userTicket.setVersion(integerUtils.toObject(data));
    return userTicket;
  }
}