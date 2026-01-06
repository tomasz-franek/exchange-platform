package org.exchange.app.backend.common.deserializers;

import static org.exchange.app.backend.common.serializers.PairSerializer.NULL_BYTE;

import com.fasterxml.jackson.databind.ObjectMapper;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import org.apache.kafka.common.serialization.Deserializer;
import org.exchange.app.backend.common.utils.ByteArrayData;
import org.exchange.app.backend.common.utils.IntegerUtils;
import org.exchange.app.common.api.model.OrderBookData;

public class OrderBookListDeserializer implements Deserializer<List<OrderBookData>> {

  private final ObjectMapper objectMapper = new ObjectMapper();
  private final IntegerUtils integerUtils = new IntegerUtils();
  private final OrderBookDeserializer orderBookDeserializer = new OrderBookDeserializer();

  @Override
  public List<OrderBookData> deserialize(String topic, byte[] data) {
    return this.deserializeCompact(data);
  }

  public List<OrderBookData> deserializeStandard(byte[] data) {
    try {
      return Arrays.stream(objectMapper.readValue(data, OrderBookData[].class)).toList();
    } catch (Exception e) {
      throw new RuntimeException("Error deserializing List<OrderBookData>", e);
    }
  }

  public List<OrderBookData> deserializeCompact(byte[] data) {
    return this.deserializeCompact(new ByteArrayData(data));
  }

  public List<OrderBookData> deserializeCompact(ByteArrayData data) {

    if (data == null || data.bytes == null || data.bytes.length == 0) {
      throw new RuntimeException("Error deserializing List<OrderBookData>");
    }
    if (data.bytes[0] == NULL_BYTE) {
      return null;
    }

    int rows = integerUtils.toObject(data);
    List<OrderBookData> orderBookDataList = new ArrayList<>(rows);
    for (int i = 0; i < rows; i++) {
      orderBookDataList.add(orderBookDeserializer.deserializeCompact(data));
    }

    return orderBookDataList;
  }
}
