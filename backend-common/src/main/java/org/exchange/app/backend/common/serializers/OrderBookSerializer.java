package org.exchange.app.backend.common.serializers;

import static org.exchange.app.backend.common.serializers.PairSerializer.NULL_BYTE;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.extern.log4j.Log4j2;
import org.apache.kafka.common.serialization.Serializer;
import org.exchange.app.backend.common.utils.BooleanUtils;
import org.exchange.app.backend.common.utils.ByteArrayData;
import org.exchange.app.backend.common.utils.IntegerUtils;
import org.exchange.app.backend.common.utils.OrderBookRowUtils;
import org.exchange.app.backend.common.utils.PairUtils;
import org.exchange.app.common.api.model.OrderBookData;
import org.exchange.app.common.api.model.OrderBookRow;

@Log4j2
public class OrderBookSerializer implements Serializer<OrderBookData> {

  private final ObjectMapper objectMapper = new ObjectMapper();
  private final PairUtils pairUtils = new PairUtils();
  private final IntegerUtils integerUtils = new IntegerUtils();
  private final OrderBookRowUtils orderBookRowUtils = new OrderBookRowUtils();
  private final BooleanUtils booleanUtils = new BooleanUtils();

  @Override
  public byte[] serialize(String s, OrderBookData orderBookData) {
    return new byte[0];
  }

  public byte[] serializeStandard(OrderBookData data) {
    try {
      return objectMapper.writeValueAsBytes(data);
    } catch (JsonProcessingException e) {
      throw new RuntimeException("Error serializing UserTicket", e);
    }
  }

  public byte[] serializeCompact(OrderBookData data) {
    if (data == null) {
      return new byte[]{NULL_BYTE};
    }
    int totalSize = 2 * integerUtils.getSize() + pairUtils.getSize()
        + (data.getB().size() + data.getS().size()) * orderBookRowUtils.getSize()
        + booleanUtils.getSize();
    ByteArrayData out = new ByteArrayData(totalSize);

    integerUtils.toByteArray(data.getB().size(), out);
    for (OrderBookRow row : data.getB()) {
      orderBookRowUtils.toByteArray(row, out);
    }
    integerUtils.toByteArray(data.getS().size(), out);
    for (OrderBookRow row : data.getS()) {
      orderBookRowUtils.toByteArray(row, out);
    }
    pairUtils.toByteArray(data.getP(), out);
    booleanUtils.toByteArray(data.getF(), out);

    return out.bytes;
  }
}
