package org.exchange.app.backend.common.deserializers;

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
      return objectMapper.readValue(data, CoreTicket.class);
    } catch (Exception e) {
      throw new RuntimeException("Error deserializing CoreTicket", e);
    }
  }

	public CoreTicket deserializeCompact(byte[] data) {
		if (data == null || data.length != CoreTicketSerializer.BYTE_ARRAY_SIZE) {
			throw new RuntimeException("Error deserializing CoreTicket");
		}
		CoreTicket coreTicket = new CoreTicket();
    ByteArrayData byteArrayData = new ByteArrayData(data);
    coreTicket.setId(longUtils.toObject(byteArrayData));
    coreTicket.setAmount(longUtils.toObject(byteArrayData));
    coreTicket.setRatio(longUtils.toObject(byteArrayData));
    coreTicket.setEpochUtc(longUtils.toObject(byteArrayData));
    coreTicket.setUserId(uuidUtils.toObject(byteArrayData));
    coreTicket.setPair(pairUtils.toObject(byteArrayData));
    coreTicket.setDirection(directionUtils.toObject(byteArrayData));

		return coreTicket;
	}
}
