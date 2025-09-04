package org.exchange.app.backend.senders;

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
import org.springframework.stereotype.Service;

@Log4j2
@Service
public class UserTicketSenderImpl implements UserTicketSender {

  private final KafkaTemplate<Pair, UserTicket> kafkaTemplate;

  public UserTicketSenderImpl(@Value("${spring.kafka.bootstrap-servers}") String bootstrapServers) {
    this.kafkaTemplate = KafkaConfig.kafkaTemplateProducer(
        TopicToInternalBackend.EXCHANGE,
        bootstrapServers,
        PairSerializer.class,
        UserTicketSerializer.class);
  }

  @Override
  public void sendMessage(UserTicket userTicket) {
    CompletableFuture<SendResult<Pair, UserTicket>> future = kafkaTemplate.send(
        TopicToInternalBackend.EXCHANGE, userTicket.getPair(), userTicket);
    future.whenComplete((result, ex) -> {
      if (ex != null) {
        log.error("{}", ex.getMessage());
      } else {
        log.info("Sent Exchange OK");
      }
    });
  }
}
