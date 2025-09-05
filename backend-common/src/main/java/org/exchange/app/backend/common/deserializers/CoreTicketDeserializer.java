package org.exchange.app.backend.common.deserializers;

import static org.exchange.app.backend.common.serializers.PairSerializer.NULL_BYTE;

import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.apache.kafka.common.serialization.Deserializer;
import org.exchange.app.backend.common.builders.CoreTicket;
import org.exchange.app.backend.common.serializers.CoreTicketSerializer;
import org.exchange.app.backend.common.utils.ByteArrayData;
import org.exchange.app.backend.common.utils.DirectionUtils;
import org.exchange.app.backend.common.utils.LongUtils;
import org.exchange.app.backend.common.utils.PairUtils;
import org.exchange.app.backend.common.utils.UUIDUtils;

public class CoreTicketDeserializer implements Deserializer<CoreTicket> {

  private final ObjectMapper objectMapper = new ObjectMapper();
  private final LongUtils longUtils = new LongUtils();
  private final UUIDUtils uuidUtils = new UUIDUtils();
  private final DirectionUtils directionUtils = new DirectionUtils();
  private final PairUtils pairUtils = new PairUtils();

  @Override
  public CoreTicket deserialize(String topic, byte[] data) {
    return this.deserializeStandard(data);
  }

  public CoreTicket deserializeStandard(byte[] data) {
    try {
      objectMapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);
      return objectMapper.readValue(data, CoreTicket.class);
    } catch (Exception e) {
      throw new RuntimeException("Error deserializing CoreTicket", e);
    }
  }

  public CoreTicket deserializeCompact(byte[] data) {
    if (data == null || data.length != CoreTicketSerializer.getSize()) {
      throw new RuntimeException("Error deserializing CoreTicket");
    }
    ByteArrayData byteArrayData = new ByteArrayData(data);
    return toObject(byteArrayData);
  }

  public CoreTicket toObject(ByteArrayData byteArrayData) {
    if (byteArrayData.bytes[byteArrayData.position] == NULL_BYTE) {
      byteArrayData.position += getSize() + 1;
      return null;
    } else {
      byteArrayData.position++;
      CoreTicket coreTicket = new CoreTicket();
      coreTicket.setId(longUtils.toObject(byteArrayData));
      coreTicket.setAmount(longUtils.toObject(byteArrayData));
      coreTicket.setRatio(longUtils.toObject(byteArrayData));
      coreTicket.setUserId(uuidUtils.toObject(byteArrayData));
      coreTicket.setPair(pairUtils.toObject(byteArrayData));
      coreTicket.setDirection(directionUtils.toObject(byteArrayData));
      return coreTicket;
    }
  }

  public int getSize() {
    return 3 * LongUtils.getSize() + UUIDUtils.getSize() + PairUtils.getSize()
        + DirectionUtils.getSize();
  }
}
