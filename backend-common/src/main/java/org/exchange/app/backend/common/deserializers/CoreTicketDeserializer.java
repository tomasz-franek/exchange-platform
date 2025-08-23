package org.exchange.app.backend.common.deserializers;

import static java.util.Arrays.copyOfRange;
import static org.exchange.app.backend.common.utils.LongUtils.byteArrayToLong;
import static org.exchange.app.backend.common.utils.UUIDUtils.byteArrayToUUID;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.apache.kafka.common.serialization.Deserializer;
import org.exchange.app.backend.common.builders.CoreTicket;
import org.exchange.app.backend.common.serializers.CoreTicketSerializer;
import org.exchange.app.backend.common.utils.DirectionUtils;

public class CoreTicketDeserializer implements Deserializer<CoreTicket> {

  private final ObjectMapper objectMapper = new ObjectMapper();

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
		int size = 9;
		coreTicket.setId(byteArrayToLong(copyOfRange(data, position, size)));
		position += size;
		coreTicket.setAmount(byteArrayToLong(copyOfRange(data, position, position + size)));
		position += size;
		coreTicket.setRatio(byteArrayToLong(copyOfRange(data, position, position + size)));
		position += size;
		coreTicket.setEpochUtc(byteArrayToLong(copyOfRange(data, position, position + size)));
		position += size;
		size = 17;
		coreTicket.setUserId(byteArrayToUUID(copyOfRange(data, position, position + size)));
		position += size;
		size = 1;
		coreTicket.setPair(
				new PairDeserializer().deserialize("", copyOfRange(data, position, position + size)));
		position += size;
		coreTicket.setDirection(
				DirectionUtils.byteArrayToDirection(copyOfRange(data, position, position + size)));

		return coreTicket;
	}
}
