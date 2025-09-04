package org.exchange.app.backend.senders;

import org.apache.kafka.common.serialization.LongSerializer;
import org.apache.kafka.common.serialization.StringSerializer;
import org.exchange.app.backend.common.builders.ExchangeResult;
import org.exchange.app.backend.common.config.KafkaConfig;
import org.exchange.app.backend.common.config.KafkaConfig.TopicToInternalBackend;
import org.exchange.app.common.api.model.UserTicketStatus;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

@Service
public class FeeCalculationSenderImpl implements FeeCalculationSender {

  private final KafkaTemplate<String, Long> kafkaTemplate;


  public FeeCalculationSenderImpl(
      @Value("${spring.kafka.bootstrap-servers}") String bootstrapServers) {
    this.kafkaTemplate = KafkaConfig.kafkaTemplateProducer(
        TopicToInternalBackend.FEE_CALCULATION, bootstrapServers,
        StringSerializer.class,
        LongSerializer.class);
  }

  @Autowired
  public FeeCalculationSenderImpl(KafkaTemplate<String, Long> kafkaTemplate) {
    this.kafkaTemplate = kafkaTemplate;
  }

  public void sendFeeCalculation(ExchangeResult exchangeResult) {
    if (exchangeResult.getBuyTicketAfterExchange() != null
        && exchangeResult.getBuyTicketAfterExchange().isFinishOrder()
        && exchangeResult.getBuyTicket() != null) {
      kafkaTemplate.send(TopicToInternalBackend.FEE_CALCULATION,
          exchangeResult.getBuyTicket().getId());
    }
    if (exchangeResult.getSellTicketAfterExchange() != null
        && exchangeResult.getSellTicketAfterExchange().isFinishOrder()
        && exchangeResult.getSellTicket() != null) {
      kafkaTemplate.send(TopicToInternalBackend.FEE_CALCULATION,
          exchangeResult.getSellTicket().getId());
    }
    if (exchangeResult.getCancelledTicket() != null && UserTicketStatus.PARTIAL_CANCELED.equals(
        exchangeResult.getUserTicketStatus())) {
      kafkaTemplate.send(TopicToInternalBackend.FEE_CALCULATION,
          exchangeResult.getCancelledTicket().getId());
    }
  }
}
