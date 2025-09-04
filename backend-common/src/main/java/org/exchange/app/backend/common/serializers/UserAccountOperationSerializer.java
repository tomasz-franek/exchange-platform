package org.exchange.app.backend.common.serializers;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.apache.kafka.common.serialization.Serializer;
import org.exchange.app.backend.common.utils.ByteArrayData;
import org.exchange.app.backend.common.utils.CurrencyUtils;
import org.exchange.app.backend.common.utils.LongUtils;
import org.exchange.app.backend.common.utils.UUIDUtils;
import org.exchange.app.common.api.model.UserAccountOperation;

public class UserAccountOperationSerializer implements Serializer<UserAccountOperation> {

  private final ObjectMapper objectMapper = new ObjectMapper();
  private final LongUtils longUtils = new LongUtils();
  private final UUIDUtils uuidUtils = new UUIDUtils();
  private final CurrencyUtils currencyUtils = new CurrencyUtils();
  public final static byte BYTE_ARRAY_SIZE = 44;

  @Override
  public byte[] serialize(String topic, UserAccountOperation data) {
    return this.serializeStandard(data);
  }

  public byte[] serializeCompact(UserAccountOperation data) {
    ByteArrayData out = new ByteArrayData(getSize());
    longUtils.toByteArray(data.getAmount(), out);
    uuidUtils.toByteArray(data.getUserId(), out);
    uuidUtils.toByteArray(data.getUserAccountId(), out);
    currencyUtils.toByteArray(data.getCurrency(), out);
    return out.bytes;
  }

  public byte[] serializeStandard(UserAccountOperation data) {
    try {
      return objectMapper.writeValueAsBytes(data);
    } catch (JsonProcessingException e) {
      throw new RuntimeException("Error serializing UserAccountOperation", e);
    }
  }

  public static int getSize() {
    return LongUtils.getSize() + 2 * UUIDUtils.getSize() + CurrencyUtils.getSize();
  }
}

