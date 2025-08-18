package org.exchange.app.backend.producers;


import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.TimeUnit;
import lombok.extern.log4j.Log4j2;
import org.apache.kafka.common.serialization.StringSerializer;
import org.exchange.app.backend.common.config.KafkaConfig;
import org.exchange.app.backend.common.config.KafkaConfig.TopicToInternalBackend;
import org.exchange.app.backend.db.repositories.ExchangeEventSourceRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.kafka.support.SendResult;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Log4j2
@Component
public class SnapshotProducer {

  private final KafkaTemplate<String, String> kafkaTemplate;
  private final ExchangeEventSourceRepository exchangeEventSourceRepository;

  public SnapshotProducer(
      @Value("${spring.kafka.bootstrap-servers}") String bootstrapServers,
      ExchangeEventSourceRepository exchangeEventSourceRepository) {
    this.kafkaTemplate = KafkaConfig.kafkaTemplateProducer(
        TopicToInternalBackend.SNAPSHOT, bootstrapServers, StringSerializer.class,
        StringSerializer.class);
    this.exchangeEventSourceRepository = exchangeEventSourceRepository;
  }

  public void sendMessage(List<String> days) {
    String snapshotRequest = String.join(":", days);
    CompletableFuture<SendResult<String, String>> future
        = kafkaTemplate.send(TopicToInternalBackend.SNAPSHOT, snapshotRequest,
        snapshotRequest);
    future.whenComplete((result, ex) -> {
      if (ex != null) {
        log.error("{}", ex.getMessage());
      } else {
        log.info("Sent OK days={} topic={}",
            result.getProducerRecord().value(),
            TopicToInternalBackend.SNAPSHOT);
      }
    });
  }

  @Scheduled(timeUnit = TimeUnit.MINUTES, fixedDelay = 6 * 60, initialDelay = 1)
  public void checkSnapshot() {
    log.info("Checking snapshots");
    List<String> days = new ArrayList<>();

    exchangeEventSourceRepository.getDaysWithoutSnapshot().forEach(e -> days.add(e.toString()));
    if (!days.isEmpty()) {
      sendMessage(days);
    }
  }
}
