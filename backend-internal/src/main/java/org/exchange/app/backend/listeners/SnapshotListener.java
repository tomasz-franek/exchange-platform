package org.exchange.app.backend.listeners;

import lombok.extern.log4j.Log4j2;
import org.exchange.app.backend.common.config.KafkaConfig;
import org.exchange.app.backend.common.config.KafkaConfig.Deserializers;
import org.exchange.app.backend.common.config.KafkaConfig.InternalGroups;
import org.exchange.app.backend.common.config.KafkaConfig.TopicToInternalBackend;
import org.exchange.app.backend.services.SnapshotService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.annotation.KafkaHandler;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

@Log4j2
@Service
@KafkaListener(id = "topic-snapshot-listener",
    topics = {TopicToInternalBackend.SNAPSHOT},
    groupId = InternalGroups.SNAPSHOT,
    autoStartup = KafkaConfig.AUTO_STARTUP_TRUE,
    properties = {
        "key.deserializer=" + Deserializers.STRING,
        "value.deserializer=" + Deserializers.STRING
    },
    concurrency = "1")
public class SnapshotListener {

  private final SnapshotService snapshotService;

  @Autowired
  public SnapshotListener(SnapshotService snapshotService) {
    this.snapshotService = snapshotService;
  }

  @KafkaHandler
  @Transactional(propagation = Propagation.REQUIRES_NEW)
  public void listen(@Payload String payload) {
    log.info("Received messages snapshot {}", payload);
    snapshotService.generateSnapshot(Long.parseLong(payload));

  }
}
