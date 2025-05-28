package org.exchange.app.backend.external.producers;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.UUID;
import java.util.concurrent.CompletableFuture;
import org.exchange.app.common.api.model.Direction;
import org.exchange.app.common.api.model.Pair;
import org.exchange.app.common.api.model.UserTicket;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.kafka.support.SendResult;
import org.springframework.test.util.ReflectionTestUtils;

class UserTicketProducerTest {

  @Mock
  private KafkaTemplate<Pair, UserTicket> kafkaTemplate;

  private final UserTicketProducer userTicketProducer;

  public UserTicketProducerTest() {
    MockitoAnnotations.openMocks(this);
    String bootstrapServers = "localhost:9092";
    userTicketProducer = new UserTicketProducer(bootstrapServers);
    ReflectionTestUtils.setField(userTicketProducer, "kafkaTemplate", kafkaTemplate);
  }

  @Test
  void testSend() {
    // Arrange
    String topic = UserTicketProducer.TICKET_TOPIC;
    UserTicket userTicket = new UserTicket(1L, 100L, 100L, UUID.randomUUID(), Pair.GBP_USD, 1L,
        Direction.SELL);
    CompletableFuture<SendResult<Pair, UserTicket>> future = mock(
        CompletableFuture.class);
    when(kafkaTemplate.send(topic, userTicket.getPair(), userTicket)).thenReturn(future);

    // Act
    userTicketProducer.sendMessage(userTicket);

    // Assert
    ArgumentCaptor<String> topicCaptor = ArgumentCaptor.forClass(String.class);
    ArgumentCaptor<Pair> pairCaptor = ArgumentCaptor.forClass(Pair.class);
    ArgumentCaptor<UserTicket> userTicketCaptor = ArgumentCaptor.forClass(
        UserTicket.class);
    verify(kafkaTemplate, times(1)).send(topicCaptor.capture(), pairCaptor.capture(),
        userTicketCaptor.capture());

    assertEquals(topic, topicCaptor.getValue());
    assertEquals(userTicket.getPair(), pairCaptor.getValue());
    assertEquals(userTicket, userTicketCaptor.getValue());
  }
}