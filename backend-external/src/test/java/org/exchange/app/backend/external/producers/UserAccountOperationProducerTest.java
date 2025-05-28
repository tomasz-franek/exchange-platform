package org.exchange.app.backend.external.producers;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.UUID;
import java.util.concurrent.CompletableFuture;
import org.exchange.app.external.api.model.UserAccountOperation;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.kafka.support.SendResult;
import org.springframework.test.util.ReflectionTestUtils;

class UserAccountOperationProducerTest {

  @Mock
  private KafkaTemplate<String, UserAccountOperation> kafkaTemplate;

  private final UserAccountOperationProducer userAccountOperationProducer;

  public UserAccountOperationProducerTest() {
    MockitoAnnotations.openMocks(this);
    String bootstrapServers = "localhost:9092";
    userAccountOperationProducer = new UserAccountOperationProducer(bootstrapServers);
    ReflectionTestUtils.setField(userAccountOperationProducer, "kafkaTemplate", kafkaTemplate);
  }

  @Test
  void testSend() {
    // Arrange
    String topic = UserAccountOperationProducer.PRODUCER_TOPIC;
    String operation = "testOperation";
    UserAccountOperation userAccountOperation = new UserAccountOperation(UUID.randomUUID(), "USD",
        100L);
    CompletableFuture<SendResult<String, UserAccountOperation>> future = mock(
        CompletableFuture.class);
    when(kafkaTemplate.send(topic, operation, userAccountOperation)).thenReturn(future);

    // Act
    userAccountOperationProducer.sendMessage(operation, userAccountOperation);

    // Assert
    ArgumentCaptor<String> topicCaptor = ArgumentCaptor.forClass(String.class);
    ArgumentCaptor<String> operationCaptor = ArgumentCaptor.forClass(String.class);
    ArgumentCaptor<UserAccountOperation> userAccountOperationCaptor = ArgumentCaptor.forClass(
        UserAccountOperation.class);
    verify(kafkaTemplate, times(1)).send(topicCaptor.capture(), operationCaptor.capture(),
        userAccountOperationCaptor.capture());

    assertEquals(topic, topicCaptor.getValue());
    assertEquals(operation, operationCaptor.getValue());
    assertEquals(userAccountOperation, userAccountOperationCaptor.getValue());
  }
}