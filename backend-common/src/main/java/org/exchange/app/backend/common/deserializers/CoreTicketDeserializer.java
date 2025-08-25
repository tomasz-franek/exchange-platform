package org.exchange.app.backend.common.deserializers;

import static java.util.Arrays.copyOfRange;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.apache.kafka.common.serialization.Deserializer;
import org.exchange.app.backend.common.builders.CoreTicket;
import org.exchange.app.backend.common.serializers.CoreTicketSerializer;
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
		int position = 0;
    coreTicket.setId(longUtils.toObject(copyOfRange(data, position, longUtils.getSize())));
    position += longUtils.getSize();
    coreTicket.setAmount(
        longUtils.toObject(copyOfRange(data, position, position + longUtils.getSize())));
    position += longUtils.getSize();
    coreTicket.setRatio(
        longUtils.toObject(copyOfRange(data, position, position + longUtils.getSize())));
    position += longUtils.getSize();
    coreTicket.setEpochUtc(
        longUtils.toObject(copyOfRange(data, position, position + longUtils.getSize())));
    position += longUtils.getSize();
    coreTicket.setUserId(
        uuidUtils.toObject(copyOfRange(data, position, position + uuidUtils.getSize())));
    position += uuidUtils.getSize();
    coreTicket.setPair(
        pairUtils.toObject(copyOfRange(data, position, position + pairUtils.getSize())));
    position += pairUtils.getSize();
    coreTicket.setDirection(
        directionUtils.toObject(copyOfRange(data, position, position + directionUtils.getSize())));

		return coreTicket;
	}
}
