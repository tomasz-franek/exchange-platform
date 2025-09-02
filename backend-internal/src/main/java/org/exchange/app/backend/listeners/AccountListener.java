package org.exchange.app.backend.listeners;

import java.util.List;
import java.util.concurrent.CompletableFuture;
import lombok.extern.log4j.Log4j2;
import org.apache.kafka.clients.consumer.ConsumerRecord;
import org.apache.kafka.common.serialization.StringSerializer;
import org.exchange.app.backend.common.config.KafkaConfig;
import org.exchange.app.backend.common.config.KafkaConfig.TopicToInternalBackend;
import org.exchange.app.backend.common.config.KafkaConfig.TopicsToExternalBackend;
import org.exchange.app.backend.common.serializers.OrderBookListSerializer;
import org.exchange.internal.app.core.data.OrderBook;
import org.exchange.internal.app.core.strategies.ratio.RatioStrategy;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.kafka.annotation.KafkaHandler;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.kafka.support.SendResult;
import org.springframework.stereotype.Service;

@Log4j2
@Service
@KafkaListener(id = "account-exchange-listener",
    topics = TopicToInternalBackend.ACCOUNT,
    groupId = KafkaConfig.InternalGroups.ACCOUNT,
    autoStartup = KafkaConfig.AUTO_STARTUP_TRUE,
    concurrency = "1")
public class AccountListener {

  private final KafkaTemplate<String, List<OrderBook>> kafkaOrderBookTemplate;

  @Autowired
  AccountListener(RatioStrategy ratioStrategy,
      @Value("${spring.kafka.bootstrap-servers}") String bootstrapServers) {
    this.kafkaOrderBookTemplate = KafkaConfig.kafkaTemplateProducer(
        TopicsToExternalBackend.ORDER_BOOK, bootstrapServers, StringSerializer.class,
        OrderBookListSerializer.class);
  }

  @KafkaHandler
  public void listen(ConsumerRecord<?, ?> record) {
    log.info("*** Received exchange messages {}", record.value().toString());
    CompletableFuture<SendResult<String, List<OrderBook>>> futureOrderBook =
        kafkaOrderBookTemplate.send(TopicsToExternalBackend.ORDER_BOOK, List.of());
    futureOrderBook.whenComplete((result, ex) -> {
      if (ex != null) {
        log.error("{}", ex.getMessage());
      } else {
        log.info("Sent Order Book OK");
      }
    });
  }
}
