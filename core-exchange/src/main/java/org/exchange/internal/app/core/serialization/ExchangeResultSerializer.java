package org.exchange.internal.app.core.serialization;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.time.ZoneOffset;
import lombok.extern.log4j.Log4j2;
import org.apache.kafka.common.serialization.Serializer;
import org.exchange.app.backend.common.serializers.CoreTicketSerializer;
import org.exchange.app.backend.common.utils.ByteArrayData;
import org.exchange.app.backend.common.utils.LongUtils;
import org.exchange.internal.app.core.data.ExchangeResult;

@Log4j2
public class ExchangeResultSerializer implements Serializer<ExchangeResult> {

  private final ObjectMapper objectMapper = new ObjectMapper();
  private final CoreTicketSerializer coreTicketSerializer = new CoreTicketSerializer();
  private final LongUtils longUtils = new LongUtils();

  @Override
  public byte[] serialize(String topic, ExchangeResult data) {
    return this.serializeStandard(data);
  }

  public byte[] serializeStandard(ExchangeResult data) {
    try {
      byte[] bytes = objectMapper.writeValueAsBytes(data);
      log.info(bytes);
      return bytes;
    } catch (JsonProcessingException e) {
      throw new RuntimeException("Error serializing ExchangeResult", e);
    }
  }

  public byte[] serializeCompact(ExchangeResult data) {
    ByteArrayData out = new ByteArrayData(getSize());
    coreTicketSerializer.toByteArray(data.getBuyTicket(), out);
    coreTicketSerializer.toByteArray(data.getSellTicket(), out);
    coreTicketSerializer.toByteArray(data.getBuyExchange(), out);
    coreTicketSerializer.toByteArray(data.getSellExchange(), out);
    coreTicketSerializer.toByteArray(data.getBuyTicketAfterExchange(), out);
    coreTicketSerializer.toByteArray(data.getSellTicketAfterExchange(), out);
    coreTicketSerializer.toByteArray(data.getCancelledTicket(), out);
    longUtils.toByteArray(data.getExchangeEpochUTC().toEpochSecond(ZoneOffset.UTC), out);

    return out.bytes;
  }

  public static int getSize() {
    return LongUtils.getSize() + 7 * CoreTicketSerializer.getSize();
  }
}
