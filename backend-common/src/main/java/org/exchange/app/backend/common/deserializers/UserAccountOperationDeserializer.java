package org.exchange.app.backend.common.deserializers;

import static java.util.Arrays.copyOfRange;
import static org.exchange.app.backend.common.utils.LongUtils.byteArrayToLong;
import static org.exchange.app.backend.common.utils.UUIDUtils.byteArrayToUUID;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.apache.kafka.common.serialization.Deserializer;
import org.exchange.app.backend.common.serializers.UserAccountOperationSerializer;
import org.exchange.app.common.api.model.UserAccountOperation;

public class UserAccountOperationDeserializer implements Deserializer<UserAccountOperation> {

  private final ObjectMapper objectMapper = new ObjectMapper();

  @Override
  public UserAccountOperation deserialize(String topic, byte[] data) {
		return this.deserializeStandard(data);
	}

	public UserAccountOperation deserializeStandard(byte[] data) {
    try {
      return objectMapper.readValue(data, UserAccountOperation.class);
    } catch (Exception e) {
      throw new RuntimeException("Error deserializing UserAccountOperation", e);
    }
  }

	public UserAccountOperation deserializeCompact(byte[] data) {
		if (data == null || data.length != UserAccountOperationSerializer.BYTE_ARRAY_SIZE) {
			throw new RuntimeException("Error deserializing UserTicket");
		}
		UserAccountOperation userAccountOperation = new UserAccountOperation();
		int position = 0;
		int size = 9;
		userAccountOperation.setAmount(byteArrayToLong(copyOfRange(data, position, size)));
		position += size;
		size = 17;
		userAccountOperation.setUserId(byteArrayToUUID(copyOfRange(data, position, position + size)));
		position += size;
		userAccountOperation.setUserAccountId(
				byteArrayToUUID(copyOfRange(data, position, position + size)));
		position += size;
		if (data[position++] == 1) {
			size = 3;
			userAccountOperation.setCurrency(
					new String(copyOfRange(data, position, position + size)));
		}
		return userAccountOperation;
	}
}
