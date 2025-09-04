package org.exchange.app.backend.senders;


import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.TimeUnit;
import lombok.extern.log4j.Log4j2;
import org.apache.kafka.common.serialization.StringSerializer;
import org.exchange.app.backend.common.config.KafkaConfig;
import org.exchange.app.backend.common.config.KafkaConfig.TopicToInternalBackend;
import org.exchange.app.backend.db.repositories.ExchangeEventSourceRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

@Log4j2
@Service
public class SnapshotSenderImpl implements SnapshotSender {

  private final KafkaTemplate<String, String> kafkaTemplate;
  private final ExchangeEventSourceRepository exchangeEventSourceRepository;

  public SnapshotSenderImpl(
      @Value("${spring.kafka.bootstrap-servers}") String bootstrapServers,
      ExchangeEventSourceRepository exchangeEventSourceRepository) {
    this.kafkaTemplate = KafkaConfig.kafkaTemplateProducer(
        TopicToInternalBackend.SNAPSHOT, bootstrapServers, StringSerializer.class,
        StringSerializer.class);
    this.exchangeEventSourceRepository = exchangeEventSourceRepository;
  }

  @Autowired
  public SnapshotSenderImpl(KafkaTemplate<String, String> kafkaTemplate,
      ExchangeEventSourceRepository exchangeEventSourceRepository) {
    this.kafkaTemplate = kafkaTemplate;
    this.exchangeEventSourceRepository = exchangeEventSourceRepository;
  }

  @Override
  public void sendMessage(List<String> days) {
    if (!days.isEmpty()) {
      String snapshotRequest = String.join(":", days);
      kafkaTemplate.send(TopicToInternalBackend.SNAPSHOT, snapshotRequest);
    }
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
