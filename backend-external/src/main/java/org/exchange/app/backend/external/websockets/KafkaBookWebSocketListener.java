package org.exchange.app.backend.external.websockets;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.util.List;
import lombok.extern.log4j.Log4j2;
import org.exchange.app.backend.common.config.KafkaConfig.Deserializers;
import org.exchange.app.backend.common.config.KafkaConfig.ExternalGroups;
import org.exchange.app.backend.common.config.KafkaConfig.TopicsToExternalBackend;
import org.exchange.app.common.api.model.OrderBookData;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.stereotype.Service;

@Log4j2
@Service
public class KafkaBookWebSocketListener {

  private final OrderBookWebSocketHandler orderBookWebSocketHandler;
  private final ObjectMapper objectMapper = new ObjectMapper();

  KafkaBookWebSocketListener(
      OrderBookWebSocketHandler orderBookWebSocketHandler) {
    this.orderBookWebSocketHandler = orderBookWebSocketHandler;
  }

  @KafkaListener(id = "websocket-order-book-listener",
      topics = {TopicsToExternalBackend.ORDER_BOOK},
      groupId = ExternalGroups.ORDER_BOOK,
      autoStartup = "true",
      properties = {
          "key.deserializer=" + Deserializers.STRING,
          "value.deserializer=" + Deserializers.ORDER_BOOK_LIST,
          "auto.offset.reset=earliest",
          "enable.auto.commit=true",
          "log.min.compaction.lag.ms=10000"
      },
      concurrency = "1")
  public void listen(@Payload List<OrderBookData> data) {
    try {
      String json = objectMapper.writeValueAsString(data);
      log.info("*** Received order book {}", json);
      orderBookWebSocketHandler.publishMessage(json);
    } catch (JsonProcessingException e) {
      log.error(e);
    }
  }
}
