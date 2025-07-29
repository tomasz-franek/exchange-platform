package org.exchange.app.backend.external.websockets;

import java.io.IOException;
import lombok.extern.log4j.Log4j2;
import org.exchange.app.backend.common.config.KafkaConfig;
import org.exchange.app.backend.common.config.KafkaConfig.Deserializers;
import org.exchange.app.backend.common.config.KafkaConfig.ExternalGroups;
import org.exchange.app.backend.common.config.KafkaConfig.TopicsToExternalBackend;
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
        "value.deserializer=" + Deserializers.STRING
    },
    concurrency = "1")
public class KafkaBookWebSocketListener {

  private final OrderBookWebSocketHandler orderBookWebSocketHandler;

  KafkaBookWebSocketListener(@Value("${spring.kafka.bootstrap-servers}") String bootstrapServers,
      OrderBookWebSocketHandler orderBookWebSocketHandler)
      throws IOException {
    this.orderBookWebSocketHandler = orderBookWebSocketHandler;
  }

  @KafkaHandler
  public void listen(@Payload String message) {
    log.info("*** Received order book {}", message);
    orderBookWebSocketHandler.publishMessage(message);
  }

}
