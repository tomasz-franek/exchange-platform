package org.exchange.app.backend.common.deserializers;

import static java.util.Arrays.copyOfRange;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.apache.kafka.common.serialization.Deserializer;
import org.exchange.app.backend.common.serializers.UserAccountOperationSerializer;
import org.exchange.app.backend.common.utils.CurrencyUtils;
import org.exchange.app.backend.common.utils.LongUtils;
import org.exchange.app.backend.common.utils.UUIDUtils;
import org.exchange.app.common.api.model.UserAccountOperation;

public class UserAccountOperationDeserializer implements Deserializer<UserAccountOperation> {

  private final ObjectMapper objectMapper = new ObjectMapper();
  private final LongUtils longUtils = new LongUtils();
  private final UUIDUtils uuidUtils = new UUIDUtils();
  private final CurrencyUtils currencyUtils = new CurrencyUtils();

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
    userAccountOperation.setAmount(
        longUtils.toObject(copyOfRange(data, position, longUtils.getSize())));
    position += longUtils.getSize();
    userAccountOperation.setUserId(
        uuidUtils.toObject(copyOfRange(data, position, position + uuidUtils.getSize())));
    position += uuidUtils.getSize();
		userAccountOperation.setUserAccountId(
        uuidUtils.toObject(copyOfRange(data, position, position + uuidUtils.getSize())));
    position += uuidUtils.getSize();
    userAccountOperation.setCurrency(
        currencyUtils.toObject(copyOfRange(data, position, position + currencyUtils.getSize())));
		return userAccountOperation;
	}
}
