package org.exchange.app.backend.senders;

import java.util.List;
import org.apache.kafka.common.serialization.StringSerializer;
import org.exchange.app.backend.common.config.KafkaConfig;
import org.exchange.app.backend.common.config.KafkaConfig.TopicsToExternalBackend;
import org.exchange.app.backend.common.serializers.OrderBookListSerializer;
import org.exchange.app.common.api.model.OrderBookData;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

@Service
public class OrderBookSenderImpl implements OrderBookSender {

  private final KafkaTemplate<String, List<OrderBookData>> kafkaTemplate;

  @Autowired
  public OrderBookSenderImpl(@Value("${spring.kafka.bootstrap-servers}") String bootstrapServers) {
    this.kafkaTemplate = KafkaConfig.kafkaTemplateProducer(
        TopicsToExternalBackend.ORDER_BOOK, bootstrapServers,
        StringSerializer.class,
        OrderBookListSerializer.class);
  }

  public OrderBookSenderImpl(KafkaTemplate<String, List<OrderBookData>> kafkaTemplate) {
    this.kafkaTemplate = kafkaTemplate;
  }


  @Override
  public void sendOrderBookData(List<OrderBookData> orderBookDataList) {
    if (!orderBookDataList.isEmpty()) {
      this.kafkaTemplate.send(TopicsToExternalBackend.ORDER_BOOK, "1", orderBookDataList);
    }
  }

  @Override
  public void sendOrderBookData(OrderBookData orderBookData) {
    if (orderBookData != null) {
      sendOrderBookData(List.of(orderBookData));
    }
  }
}
