package org.exchange.app.backend.listeners;

import java.util.concurrent.CompletableFuture;
import lombok.extern.log4j.Log4j2;
import org.apache.kafka.clients.consumer.ConsumerRecord;
import org.apache.kafka.common.serialization.StringSerializer;
import org.exchange.app.backend.common.config.KafkaConfig;
import org.exchange.strategies.ratio.RatioStrategy;
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
    topics = KafkaConfig.INTERNAL_ACCOUNT_TOPIC,
    groupId = KafkaConfig.INTERNAL_ACCOUNT_GROUP,
    autoStartup = "${listen.auto.start:true}",
    concurrency = "1")
public class AccountListener {

  private final KafkaTemplate<String, String> kafkaOrderBookTemplate;

  @Autowired
  AccountListener(RatioStrategy ratioStrategy,
      @Value("${spring.kafka.bootstrap-servers}") String bootstrapServers) {
    this.kafkaOrderBookTemplate = KafkaConfig.kafkaTemplateProducer(
        KafkaConfig.EXTERNAL_ORDER_BOOK_TOPIC, bootstrapServers, StringSerializer.class,
        StringSerializer.class);
  }

  @KafkaHandler
  public void listen(ConsumerRecord<?, ?> record) {
    log.info("*** Received exchange messages {}", record.value().toString());
    CompletableFuture<SendResult<String, String>> futureOrderBook =
        kafkaOrderBookTemplate.send(KafkaConfig.EXTERNAL_ORDER_BOOK_TOPIC, "[]");
    futureOrderBook.whenComplete((result, ex) -> {
      if (ex != null) {
        log.error("{}", ex.getMessage());
      } else {
        log.info("Sent Order Book OK");
      }
    });
  }
}
