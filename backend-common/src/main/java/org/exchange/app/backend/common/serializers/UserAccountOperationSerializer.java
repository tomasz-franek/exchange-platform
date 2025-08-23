package org.exchange.app.backend.common.serializers;

import static org.exchange.app.backend.common.serializers.PairSerializer.NULL_BYTE;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.apache.kafka.common.serialization.Serializer;
import org.exchange.app.backend.common.utils.LongUtils;
import org.exchange.app.backend.common.utils.UUIDUtils;
import org.exchange.app.common.api.model.UserAccountOperation;

public class UserAccountOperationSerializer implements Serializer<UserAccountOperation> {

  private final ObjectMapper objectMapper = new ObjectMapper();
	public final static byte BYTE_ARRAY_SIZE = 47;

	@Override
	public byte[] serialize(String topic, UserAccountOperation data) {
		return this.serializeStandard(data);
	}

	public byte[] serializeCompact(UserAccountOperation data) {
		byte[] out = new byte[BYTE_ARRAY_SIZE];
		byte[] current;
		int position = 0;
		current = LongUtils.longToByteArray(data.getAmount());
		int currentSizeBytes = 9;
		System.arraycopy(current, 0, out, position, currentSizeBytes);
		position += currentSizeBytes;
		current = UUIDUtils.uuidToByteArray(data.getUserId());
		currentSizeBytes = 17;
		System.arraycopy(current, 0, out, position, currentSizeBytes);
		position += currentSizeBytes;
		current = UUIDUtils.uuidToByteArray(data.getUserAccountId());
		System.arraycopy(current, 0, out, position, currentSizeBytes);
		position += currentSizeBytes;
		if (data.getCurrency() != null) {
			current = new byte[]{1};
			currentSizeBytes = 1;
			System.arraycopy(current, 0, out, position, currentSizeBytes);
			position += currentSizeBytes;
			current = data.getCurrency().getBytes();
			currentSizeBytes = 3;
			System.arraycopy(current, 0, out, position, currentSizeBytes);
		} else {
			current = new byte[]{NULL_BYTE, NULL_BYTE, NULL_BYTE, NULL_BYTE};
			currentSizeBytes = 4;
			System.arraycopy(current, 0, out, position, currentSizeBytes);
		}
		return out;
	}

	public byte[] serializeStandard(UserAccountOperation data) {
    try {
      return objectMapper.writeValueAsBytes(data);
    } catch (JsonProcessingException e) {
      throw new RuntimeException("Error serializing UserAccountOperation", e);
    }
  }
}

