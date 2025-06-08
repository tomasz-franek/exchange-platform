package org.exchange.app.backend.external.producers;

import java.util.concurrent.CompletableFuture;
import lombok.extern.log4j.Log4j2;
import org.exchange.app.backend.common.config.KafkaConfig;
import org.exchange.app.backend.common.config.KafkaConfig.TopicToInternalBackend;
import org.exchange.app.backend.common.serializers.PairSerializer;
import org.exchange.app.backend.common.serializers.UserTicketSerializer;
import org.exchange.app.common.api.model.Pair;
import org.exchange.app.common.api.model.UserTicket;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.kafka.support.SendResult;
import org.springframework.stereotype.Component;

@Log4j2
@Component
public class InternalTicketProducer {

  private final KafkaTemplate<Pair, UserTicket> kafkaTemplate;

  public InternalTicketProducer(
      @Value("${spring.kafka.bootstrap-servers}") String bootstrapServers) {
    this.kafkaTemplate = KafkaConfig.kafkaTemplateProducer(
        TopicToInternalBackend.TICKET, bootstrapServers, PairSerializer.class,
        UserTicketSerializer.class);
  }

  public void sendMessage(UserTicket userTicket) {
    CompletableFuture<SendResult<Pair, UserTicket>> future = kafkaTemplate.send(
        TopicToInternalBackend.TICKET, userTicket.getPair(), userTicket);
    future.whenComplete((result, ex) -> {
      if (ex != null) {
        log.error("{}", ex.getMessage());
      } else {
        log.info("Sent OK id={} topic={}",
            result.getProducerRecord().value().getId(),
            TopicToInternalBackend.TICKET);
      }
    });
  }
}
