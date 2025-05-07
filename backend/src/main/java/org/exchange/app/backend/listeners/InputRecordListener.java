package org.exchange.app.backend.listeners;

import exchange.app.api.model.OrderTicket;
import java.util.List;
import lombok.extern.log4j.Log4j2;
import org.exchange.app.backend.configs.KafkaConfig;
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
      @Payload String message,
      @Header(KafkaHeaders.RECEIVED_PARTITION) int partition) {
    log.info("Partition {}", partition);
    log.info("Pair {}", KafkaConfig.toPair(partition));
    log.info("*** message received from broker, job id = '{}'", message);

  }

  @KafkaHandler
  public void listen(
      @Payload OrderTicket message,
      @Header(KafkaHeaders.RECEIVED_PARTITION) int partition) {
    log.info("Partition {}", partition);
    log.info("Pair {}", KafkaConfig.toPair(partition));
    log.info("*** message received from broker, job id = '{}'", message.getId());

  }

  @KafkaHandler
  public void listen(
      @Payload List<OrderTicket> ticketList,
      @Header(KafkaHeaders.RECEIVED_PARTITION) int partition) {
    log.info("Partition {}", partition);
    log.info("Pair {}", KafkaConfig.toPair(partition));
    for (OrderTicket message : ticketList) {
      log.info("*** message received from broker, job id = '{}'", message.getId());
    }

  }
}
