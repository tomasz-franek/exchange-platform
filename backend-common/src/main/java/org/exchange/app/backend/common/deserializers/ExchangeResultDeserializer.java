package org.exchange.app.backend.common.deserializers;

import com.fasterxml.jackson.databind.ObjectMapper;
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
      return objectMapper.readValue(data, ExchangeResult.class);
    } catch (Exception e) {
      throw new RuntimeException("Error deserializing CoreTicket", e);
    }
  }

  public ExchangeResult deserializeCompact(byte[] data) {
    if (data == null || data.length != ExchangeResultSerializer.getSize()) {
      throw new RuntimeException("Error deserializing ExchangeResult");
    }
    ExchangeResult exchangeResult = new ExchangeResult();
    ByteArrayData byteArrayData = new ByteArrayData(data);
    exchangeResult.setBuyTicket(coreTicketDeserializer.toObject(byteArrayData));
    exchangeResult.setSellTicket(coreTicketDeserializer.toObject(byteArrayData));
    exchangeResult.setBuyExchange(coreTicketDeserializer.toObject(byteArrayData));
    exchangeResult.setSellExchange(coreTicketDeserializer.toObject(byteArrayData));
    exchangeResult.setBuyTicketAfterExchange(coreTicketDeserializer.toObject(byteArrayData));
    exchangeResult.setSellTicketAfterExchange(coreTicketDeserializer.toObject(byteArrayData));
    exchangeResult.setCancelledTicket(coreTicketDeserializer.toObject(byteArrayData));
    exchangeResult.setExchangeEpochUTC(
        LocalDateTime.ofEpochSecond(longUtils.toObject(byteArrayData),
            integerUtils.toObject(byteArrayData), ZoneOffset.UTC));

    return exchangeResult;
  }


}
