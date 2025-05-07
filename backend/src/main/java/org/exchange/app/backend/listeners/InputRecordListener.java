package org.exchange.app.backend.listeners;

import java.util.List;
import lombok.extern.log4j.Log4j2;
import org.exchange.app.backend.configs.KafkaConfig;
import org.exchange.app.backend.configs.KafkaOrderTicket;
import org.springframework.kafka.annotation.KafkaHandler;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.kafka.support.KafkaHeaders;
import org.springframework.messaging.handler.annotation.Header;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.stereotype.Service;

@Log4j2
@Service
@KafkaListener(id = "input-record-idw",
    topics = KafkaConfig.INPUT_RECORD_TOPIC_NAME,
    autoStartup = "${listen.auto.start:true}",
    concurrency = "${listen.concurrency:3}",
    containerFactory = "")
public class InputRecordListener {

  @KafkaHandler
  public void listen(
      @Payload KafkaOrderTicket message,
      @Header(KafkaHeaders.RECEIVED_PARTITION) int partition) {
    log.info("Partition {}", partition);
    log.info("Pair {}", KafkaConfig.toPair(partition));
    log.info("*** message received from broker, job id = '{}'", message.getId());

  }

  @KafkaHandler
  public void listen(
      @Payload List<KafkaOrderTicket> ticketList,
      @Header(KafkaHeaders.RECEIVED_PARTITION) int partition) {
    log.info("Partition {}", partition);
    log.info("Pair {}", KafkaConfig.toPair(partition));
    for (KafkaOrderTicket ticket : ticketList) {
      log.info("*** message received from broker, job id = '{}'", ticket.getId());
    }

  }
}
