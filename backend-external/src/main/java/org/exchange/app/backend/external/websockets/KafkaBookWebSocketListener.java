package org.exchange.app.backend.external.websockets;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.io.IOException;
import java.util.List;
import lombok.extern.log4j.Log4j2;
import org.exchange.app.backend.common.config.KafkaConfig;
import org.exchange.app.backend.common.config.KafkaConfig.Deserializers;
import org.exchange.app.backend.common.config.KafkaConfig.ExternalGroups;
import org.exchange.app.backend.common.config.KafkaConfig.TopicsToExternalBackend;
import org.exchange.app.common.api.model.OrderBookData;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.kafka.annotation.KafkaHandler;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.stereotype.Service;

@Log4j2
@Service
@KafkaListener(id = "websocket-order-book-listener",
    topics = TopicsToExternalBackend.ORDER_BOOK,
    groupId = ExternalGroups.ORDER_BOOK,
    autoStartup = KafkaConfig.AUTO_STARTUP_TRUE,
    properties = {
        "key.deserializer=" + Deserializers.STRING,
        "value.deserializer=" + Deserializers.ORDER_BOOK_LIST
    },
    concurrency = "1")
public class KafkaBookWebSocketListener {

  private final OrderBookWebSocketHandler orderBookWebSocketHandler;
  private final ObjectMapper objectMapper;

  KafkaBookWebSocketListener(@Value("${spring.kafka.bootstrap-servers}") String bootstrapServers,
      OrderBookWebSocketHandler orderBookWebSocketHandler,
      ObjectMapper objectMapper)
      throws IOException {
    this.orderBookWebSocketHandler = orderBookWebSocketHandler;
    this.objectMapper = objectMapper;
  }

  @KafkaHandler
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
