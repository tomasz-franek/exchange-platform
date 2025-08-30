package org.exchange.app.backend.common.serializers;

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
public class CoreTicketSerializer implements Serializer<CoreTicket> {

  private final ObjectMapper objectMapper = new ObjectMapper();
  public final static byte BYTE_ARRAY_SIZE = 55;
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
    ByteArrayData out = new ByteArrayData(BYTE_ARRAY_SIZE);
    toByteArray(data, out);
    return out.bytes;
	}

  public void toByteArray(CoreTicket data, ByteArrayData out) {
    longUtils.toByteArray(data.getId(), out);
    longUtils.toByteArray(data.getAmount(), out);
    longUtils.toByteArray(data.getRatio(), out);
    longUtils.toByteArray(data.getEpochUtc(), out);
    uuidUtils.toByteArray(data.getUserId(), out);
    pairUtils.toByteArray(data.getPair(), out);
    directionUtils.toByteArray(data.getDirection(), out);
  }

  public static int getSize() {
    return BYTE_ARRAY_SIZE;
  }
}
