package org.exchange.app.backend.common.serializers;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.extern.log4j.Log4j2;
import org.apache.kafka.common.serialization.Serializer;
import org.exchange.app.backend.common.utils.ByteArrayData;
import org.exchange.app.backend.common.utils.DirectionUtils;
import org.exchange.app.backend.common.utils.EventTypeUtils;
import org.exchange.app.backend.common.utils.IntegerUtils;
import org.exchange.app.backend.common.utils.LongUtils;
import org.exchange.app.backend.common.utils.PairUtils;
import org.exchange.app.backend.common.utils.UUIDUtils;
import org.exchange.app.backend.common.utils.UserTicketStatusUtils;
import org.exchange.app.common.api.model.UserTicket;

@Log4j2
public class UserTicketSerializer extends SerializerSize implements Serializer<UserTicket> {

  private final ObjectMapper objectMapper = new ObjectMapper();
  private final LongUtils longUtils = new LongUtils();
  private final UUIDUtils uuidUtils = new UUIDUtils();
  private final PairUtils pairUtils = new PairUtils();
  private final DirectionUtils directionUtils = new DirectionUtils();
  private final IntegerUtils integerUtils = new IntegerUtils();
  private final UserTicketStatusUtils userTicketStatusUtils = new UserTicketStatusUtils();
  private final EventTypeUtils eventTypeUtils = new EventTypeUtils();
  

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
    ByteArrayData out = new ByteArrayData(getSize());
    longUtils.toByteArray(data.getId(), out);
    longUtils.toByteArray(data.getAmount(), out);
    longUtils.toByteArray(data.getRatio(), out);
    uuidUtils.toByteArray(data.getUserId(), out);
    uuidUtils.toByteArray(data.getUserAccountId(), out);
    pairUtils.toByteArray(data.getPair(), out);
    longUtils.toByteArray(data.getEpochUtc(), out);
    directionUtils.toByteArray(data.getDirection(), out);
    eventTypeUtils.toByteArray(data.getEventType(), out);
    userTicketStatusUtils.toByteArray(data.getTicketStatus(), out);
    longUtils.toByteArray(data.getUpdatedDateUtc(), out);
    integerUtils.toByteArray(data.getVersion(), out);
    return out.bytes;
  }

  public static int getSize() {
    return 5 * LongUtils.getSize() + 2 * UUIDUtils.getSize() + PairUtils.getSize()
        + DirectionUtils.getSize() + EventTypeUtils.getSize() + UserTicketStatusUtils.getSize()
        + IntegerUtils.getSize();
  }
}