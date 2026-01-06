package org.exchange.app.backend.common.deserializers;

import static org.exchange.app.backend.common.serializers.PairSerializer.NULL_BYTE;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.apache.kafka.common.serialization.Deserializer;
import org.exchange.app.backend.common.utils.BooleanUtils;
import org.exchange.app.backend.common.utils.ByteArrayData;
import org.exchange.app.backend.common.utils.IntegerUtils;
import org.exchange.app.backend.common.utils.OrderBookRowUtils;
import org.exchange.app.backend.common.utils.PairUtils;
import org.exchange.app.common.api.model.OrderBookData;

public class OrderBookDeserializer implements Deserializer<OrderBookData> {

  private final ObjectMapper objectMapper = new ObjectMapper();
  private final PairUtils pairUtils = new PairUtils();
  private final IntegerUtils integerUtils = new IntegerUtils();
  private final OrderBookRowUtils orderBookRowUtils = new OrderBookRowUtils();
  private final BooleanUtils booleanUtils = new BooleanUtils();

  @Override
  public OrderBookData deserialize(String topic, byte[] data) {
    return this.deserializeCompact(data);
  }

  public OrderBookData deserializeStandard(byte[] data) {
    try {
      return objectMapper.readValue(data, OrderBookData.class);
    } catch (Exception e) {
      throw new RuntimeException("Error deserializing OrderBookData", e);
    }
  }

  public OrderBookData deserializeCompact(byte[] data) {
    return this.deserializeCompact(new ByteArrayData(data));
  }

  public OrderBookData deserializeCompact(ByteArrayData data) {

    if (data == null || data.bytes == null || data.bytes.length == 0) {
      throw new RuntimeException("Error deserializing OrderBookData");
    }
    if (data.bytes[0] == NULL_BYTE) {
      return null;
    }

    OrderBookData orderBookData = new OrderBookData();
    int rows = integerUtils.toObject(data);
    for (int i = 0; i < rows; i++) {
      orderBookData.getB().add(orderBookRowUtils.toObject(data));
    }
    rows = integerUtils.toObject(data);
    for (int i = 0; i < rows; i++) {
      orderBookData.getS().add(orderBookRowUtils.toObject(data));
    }
    orderBookData.setP(pairUtils.toObject(data));
    orderBookData.setF(booleanUtils.toObject(data));

    return orderBookData;
  }
}
