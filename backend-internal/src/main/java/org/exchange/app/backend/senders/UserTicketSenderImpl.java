package org.exchange.app.backend.senders;

import lombok.extern.log4j.Log4j2;
import org.exchange.app.backend.common.config.KafkaConfig;
import org.exchange.app.backend.common.config.KafkaConfig.TopicToInternalBackend;
import org.exchange.app.backend.common.serializers.PairSerializer;
import org.exchange.app.backend.common.serializers.UserTicketSerializer;
import org.exchange.app.common.api.model.Pair;
import org.exchange.app.common.api.model.UserTicket;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

@Log4j2
@Service
public class UserTicketSenderImpl implements UserTicketSender {

  private final KafkaTemplate<Pair, UserTicket> kafkaTemplate;

  @Autowired
  public UserTicketSenderImpl(@Value("${spring.kafka.bootstrap-servers}") String bootstrapServers) {
    this.kafkaTemplate = KafkaConfig.kafkaTemplateProducer(
        TopicToInternalBackend.EXCHANGE,
        bootstrapServers,
        PairSerializer.class,
        UserTicketSerializer.class);
  }

  public UserTicketSenderImpl(KafkaTemplate<Pair, UserTicket> kafkaTemplate) {
    this.kafkaTemplate = kafkaTemplate;
  }


  @Override
  public void sendMessage(UserTicket userTicket) {
    if (userTicket != null) {
      kafkaTemplate.send(TopicToInternalBackend.EXCHANGE, userTicket.getPair(), userTicket);
    }
  }
}
