package org.exchange.app.backend.senders;

import java.util.Collections;
import java.util.List;
import org.exchange.app.backend.common.config.KafkaConfig.TopicsToExternalBackend;
import org.exchange.app.common.api.model.OrderBookData;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.kafka.core.KafkaTemplate;

import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;

class OrderBookSenderImplTest {

  @Mock
  private KafkaTemplate<String, List<OrderBookData>> kafkaTemplate;

  @InjectMocks
  private OrderBookSenderImpl orderBookSender;

  @BeforeEach
  void setUp() {
    MockitoAnnotations.openMocks(this);
    kafkaTemplate = mock(KafkaTemplate.class);
    orderBookSender = new OrderBookSenderImpl(kafkaTemplate);
  }

  @Test
  void sendOrderBookData_should_sendRequestWithList_when_listPrepared() {
    OrderBookData orderBookData1 = new OrderBookData();
    OrderBookData orderBookData2 = new OrderBookData();
    List<OrderBookData> orderBookDataList = List.of(orderBookData1, orderBookData2);

    orderBookSender.sendOrderBookData(orderBookDataList);

    verify(kafkaTemplate, times(1)).send(TopicsToExternalBackend.ORDER_BOOK, "1",
        orderBookDataList);
  }

  @Test
  void sendOrderBookData_should_sendRequestWithList_when_singleOrderBookData() {
    OrderBookData orderBookData = new OrderBookData();

    orderBookSender.sendOrderBookData(orderBookData);

    verify(kafkaTemplate, times(1)).send(TopicsToExternalBackend.ORDER_BOOK, "1",
        List.of(orderBookData));
  }

  @Test
  void sendOrderBookData_should_notSendRequestWithList_when_emptyList() {
    List<OrderBookData> emptyList = Collections.emptyList();

    orderBookSender.sendOrderBookData(emptyList);

    verify(kafkaTemplate, never()).send(TopicsToExternalBackend.ORDER_BOOK, emptyList);
  }

  @Test
  void sendOrderBookData_should_notSendRequestWithList_when_nullOrderBookData() {
    OrderBookData orderBookData = null;

    orderBookSender.sendOrderBookData(orderBookData);

    verify(kafkaTemplate, never()).send(TopicsToExternalBackend.ORDER_BOOK,
        Collections.emptyList());
  }
}