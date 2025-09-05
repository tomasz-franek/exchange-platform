package org.exchange.app.backend.common.serializers;

import static org.exchange.app.backend.common.serializers.PairSerializer.NULL_BYTE;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.extern.log4j.Log4j2;
import org.apache.kafka.common.serialization.Serializer;
import org.exchange.app.backend.common.builders.CoreTicket;
import org.exchange.app.backend.common.utils.ByteArrayData;
import org.exchange.app.backend.common.utils.DirectionUtils;
import org.exchange.app.backend.common.utils.LongUtils;
import org.exchange.app.backend.common.utils.PairUtils;
import org.exchange.app.backend.common.utils.UUIDUtils;

@Log4j2
public class CoreTicketSerializer extends SerializerSize implements Serializer<CoreTicket> {

  private final ObjectMapper objectMapper = new ObjectMapper();
  private final LongUtils longUtils = new LongUtils();
  private final UUIDUtils uuidUtils = new UUIDUtils();
  private final PairUtils pairUtils = new PairUtils();
  private final DirectionUtils directionUtils = new DirectionUtils();


  @Override
  public byte[] serialize(String topic, CoreTicket data) {
    return this.serializeStandard(data);
  }

  public byte[] serializeStandard(CoreTicket data) {
    try {
      return objectMapper.writeValueAsBytes(data);
    } catch (JsonProcessingException e) {
      throw new RuntimeException("Error serializing UserTicket", e);
    }
  }

  public byte[] serializeCompact(CoreTicket data) {
    ByteArrayData out = new ByteArrayData(getSize());
    toByteArray(data, out);
    return out.bytes;
  }

  public void toByteArray(CoreTicket data, ByteArrayData out) {
    if (data != null) {
      out.bytes[out.position++] = 1;
      longUtils.toByteArray(data.getId(), out);
      longUtils.toByteArray(data.getAmount(), out);
      longUtils.toByteArray(data.getRatio(), out);
      uuidUtils.toByteArray(data.getUserId(), out);
      pairUtils.toByteArray(data.getPair(), out);
      directionUtils.toByteArray(data.getDirection(), out);
    } else {
      out.bytes[out.position] = NULL_BYTE;
      out.position += getSize();
    }
  }

  public static int getSize() {
    return 1 + 3 * LongUtils.getSize() + UUIDUtils.getSize() + PairUtils.getSize()
        + DirectionUtils.getSize();
  }
}
