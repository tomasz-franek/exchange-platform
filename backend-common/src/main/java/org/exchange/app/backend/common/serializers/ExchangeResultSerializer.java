package org.exchange.app.backend.common.serializers;

import static org.exchange.app.backend.common.serializers.PairSerializer.NULL_BYTE;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import java.time.LocalDateTime;
import java.time.ZoneOffset;
import lombok.extern.log4j.Log4j2;
import org.apache.kafka.common.serialization.Serializer;
import org.exchange.app.backend.common.builders.ExchangeResult;
import org.exchange.app.backend.common.utils.ByteArrayData;
import org.exchange.app.backend.common.utils.IntegerUtils;
import org.exchange.app.backend.common.utils.LongUtils;
import org.exchange.app.backend.common.utils.UserTicketStatusUtils;

@Log4j2
public class ExchangeResultSerializer extends SerializerSize implements Serializer<ExchangeResult> {

  private final ObjectMapper objectMapper = new ObjectMapper();
  private final CoreTicketSerializer coreTicketSerializer = new CoreTicketSerializer();
  private final LongUtils longUtils = new LongUtils();
  private final IntegerUtils integerUtils = new IntegerUtils();
  private final UserTicketStatusUtils userTicketStatusUtils = new UserTicketStatusUtils();

  @Override
  public byte[] serialize(String topic, ExchangeResult data) {
    return this.serializeStandard(data);
  }

  public byte[] serializeStandard(ExchangeResult data) {
    try {
      objectMapper.registerModule(new JavaTimeModule());
      return objectMapper.writeValueAsBytes(data);
    } catch (JsonProcessingException e) {
      throw new RuntimeException("Error serializing ExchangeResult", e);
    }
  }

  public byte[] serializeCompact(ExchangeResult data) {
    ByteArrayData out = new ByteArrayData(getSize());
    if (data == null) {
      out.bytes[out.position] = NULL_BYTE;
      return out.bytes;
    } else {
      out.bytes[out.position++] = 1;
      LocalDateTime dataExchangeEpochUTC = data.getExchangeEpochUTC();
      coreTicketSerializer.toByteArray(data.getBuyTicket(), out);
      coreTicketSerializer.toByteArray(data.getSellTicket(), out);
      coreTicketSerializer.toByteArray(data.getBuyExchange(), out);
      coreTicketSerializer.toByteArray(data.getSellExchange(), out);
      coreTicketSerializer.toByteArray(data.getBuyTicketAfterExchange(), out);
      coreTicketSerializer.toByteArray(data.getSellTicketAfterExchange(), out);
      coreTicketSerializer.toByteArray(data.getCancelledTicket(), out);
      userTicketStatusUtils.toByteArray(data.getUserTicketStatus(), out);
      if (dataExchangeEpochUTC == null) {
        out.bytes[out.position++] = NULL_BYTE;
        out.position += LongUtils.getSize() + IntegerUtils.getSize();
      } else {
        out.bytes[out.position++] = 1;
        longUtils.toByteArray(dataExchangeEpochUTC.toEpochSecond(ZoneOffset.UTC), out);
        integerUtils.toByteArray(dataExchangeEpochUTC.getNano(), out);
      }
      return out.bytes;
    }
  }

  public static int getSize() {
    return 2 +
        IntegerUtils.getSize() +
        LongUtils.getSize() +
        7 * CoreTicketSerializer.getSize() +
        UserTicketStatusUtils.getSize();
  }
}
