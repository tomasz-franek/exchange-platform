package org.exchange.app.backend.common.deserializers;

import static org.exchange.app.backend.common.serializers.PairSerializer.NULL_BYTE;

import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import java.time.LocalDateTime;
import java.time.ZoneOffset;
import lombok.extern.log4j.Log4j2;
import org.apache.kafka.common.serialization.Deserializer;
import org.exchange.app.backend.common.builders.ExchangeResult;
import org.exchange.app.backend.common.serializers.ExchangeResultSerializer;
import org.exchange.app.backend.common.utils.ByteArrayData;
import org.exchange.app.backend.common.utils.IntegerUtils;
import org.exchange.app.backend.common.utils.LongUtils;

@Log4j2
public class ExchangeResultDeserializer implements Deserializer<ExchangeResult> {

  private final ObjectMapper objectMapper = new ObjectMapper();
  private final LongUtils longUtils = new LongUtils();
  private final IntegerUtils integerUtils = new IntegerUtils();
  private final CoreTicketDeserializer coreTicketDeserializer = new CoreTicketDeserializer();

  @Override
  public ExchangeResult deserialize(String topic, byte[] data) {
    return this.deserializeStandard(data);
  }

  public ExchangeResult deserializeStandard(byte[] data) {
    try {
      objectMapper.registerModule(new JavaTimeModule());
      objectMapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);
      return objectMapper.readValue(data, ExchangeResult.class);
    } catch (Exception e) {
      throw new RuntimeException("Error deserializing ExchangeResult", e);
    }
  }

  public ExchangeResult deserializeCompact(byte[] data) {
    if (data == null || data.length < ExchangeResultSerializer.getSize()) {
      throw new RuntimeException("Error deserializing ExchangeResult");
    }
    ExchangeResult exchangeResult = new ExchangeResult();
    ByteArrayData byteArrayData = new ByteArrayData(data);
    if (byteArrayData.bytes[byteArrayData.position++] == NULL_BYTE) {
      return null;
    } else {
      exchangeResult.setBuyTicket(coreTicketDeserializer.toObject(byteArrayData));
      exchangeResult.setSellTicket(coreTicketDeserializer.toObject(byteArrayData));
      exchangeResult.setBuyExchange(coreTicketDeserializer.toObject(byteArrayData));
      exchangeResult.setSellExchange(coreTicketDeserializer.toObject(byteArrayData));
      exchangeResult.setBuyTicketAfterExchange(coreTicketDeserializer.toObject(byteArrayData));
      exchangeResult.setSellTicketAfterExchange(coreTicketDeserializer.toObject(byteArrayData));
      exchangeResult.setCancelledTicket(coreTicketDeserializer.toObject(byteArrayData));
      if (byteArrayData.bytes[byteArrayData.position] == NULL_BYTE) {
        byteArrayData.position += 1 + IntegerUtils.getSize() + LongUtils.getSize();
      } else {
        byteArrayData.position++;
        exchangeResult.setExchangeEpochUTC(
            LocalDateTime.ofEpochSecond(longUtils.toObject(byteArrayData),
                integerUtils.toObject(byteArrayData), ZoneOffset.UTC));
      }
      return exchangeResult;
    }
  }


}
