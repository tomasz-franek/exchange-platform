package org.exchange.app.backend.common.serializers;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.extern.log4j.Log4j2;
import org.apache.kafka.common.serialization.Serializer;
import org.exchange.app.backend.common.builders.CoreTicket;
import org.exchange.app.backend.common.utils.DirectionUtils;
import org.exchange.app.backend.common.utils.LongUtils;
import org.exchange.app.backend.common.utils.UUIDUtils;

@Log4j2
public class CoreTicketSerializer implements Serializer<CoreTicket> {

  private final ObjectMapper objectMapper = new ObjectMapper();
	public final static byte BYTE_ARRAY_SIZE = 55;


  @Override
  public byte[] serialize(String topic, CoreTicket data) {
    return this.serializeStandard(data);
  }

	public byte[] serializeStandard(CoreTicket data) {
    try {
      byte[] bytes = objectMapper.writeValueAsBytes(data);
      log.info(bytes);
      return bytes;
    } catch (JsonProcessingException e) {
      throw new RuntimeException("Error serializing UserTicket", e);
    }
  }

	public byte[] serializeCompact(CoreTicket data) {
		byte[] out = new byte[BYTE_ARRAY_SIZE];
		byte[] current;
		int position = 0;
		current = LongUtils.longToByteArray(data.getId());
		int currentSizeBytes = 9;
		System.arraycopy(current, 0, out, position, currentSizeBytes);
		position += currentSizeBytes;
		current = LongUtils.longToByteArray(data.getAmount());
		System.arraycopy(current, 0, out, position, currentSizeBytes);
		position += currentSizeBytes;
		current = LongUtils.longToByteArray(data.getRatio());
		System.arraycopy(current, 0, out, position, currentSizeBytes);
		position += currentSizeBytes;
		current = LongUtils.longToByteArray(data.getEpochUtc());
		System.arraycopy(current, 0, out, position, currentSizeBytes);
		position += currentSizeBytes;
		currentSizeBytes = 17;
		current = UUIDUtils.uuidToByteArray(data.getUserId());
		System.arraycopy(current, 0, out, position, currentSizeBytes);
		position += currentSizeBytes;
		currentSizeBytes = 1;
		current = new PairSerializer().serialize("", data.getPair());
		System.arraycopy(current, 0, out, position, currentSizeBytes);
		position += currentSizeBytes;
		current = DirectionUtils.directionToByteArray(data.getDirection());
		System.arraycopy(current, 0, out, position, currentSizeBytes);

		return out;
	}
}
