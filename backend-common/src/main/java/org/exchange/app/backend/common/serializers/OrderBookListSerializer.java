package org.exchange.app.backend.common.serializers;

import static org.exchange.app.backend.common.serializers.PairSerializer.NULL_BYTE;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.List;
import lombok.extern.log4j.Log4j2;
import org.apache.kafka.common.serialization.Serializer;
import org.exchange.app.backend.common.utils.IntegerUtils;
import org.exchange.app.common.api.model.OrderBookData;

@Log4j2
public class OrderBookListSerializer extends SerializerSize implements
    Serializer<List<OrderBookData>> {

  private final ObjectMapper objectMapper = new ObjectMapper();
  private final OrderBookSerializer orderBookSerializer = new OrderBookSerializer();
  private final IntegerUtils integerUtils = new IntegerUtils();

  @Override
  public byte[] serialize(String s, List<OrderBookData> orderBookDataList) {
    return serializeCompact(orderBookDataList);
  }

  public byte[] serializeStandard(List<OrderBookData> orderBookDataList) {
    try {
      return objectMapper.writeValueAsBytes(orderBookDataList);
    } catch (JsonProcessingException e) {
      throw new RuntimeException("Error serializing UserTicket", e);
    }
  }

  public byte[] serializeCompact(List<OrderBookData> orderBookDataList) {
    if (orderBookDataList == null) {
      return new byte[]{NULL_BYTE};
    }
    try {

      ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
      outputStream.write(integerUtils.toByteArray(orderBookDataList.size(), null));
      for (OrderBookData data : orderBookDataList) {
        outputStream.write(orderBookSerializer.serializeCompact(data));
      }
      return outputStream.toByteArray();
    } catch (IOException exception) {
      log.error("OrderBookListSerializer", exception);
    }
    return null;
  }

}
