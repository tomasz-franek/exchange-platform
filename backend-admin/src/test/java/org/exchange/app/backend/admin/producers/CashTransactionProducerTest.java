package org.exchange.app.backend.admin.producers;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.UUID;
import java.util.concurrent.CompletableFuture;
import org.exchange.app.backend.common.config.KafkaConfig.TopicToInternalBackend;
import org.exchange.app.common.api.model.UserAccountOperation;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.kafka.support.SendResult;
import org.springframework.test.util.ReflectionTestUtils;

class CashTransactionProducerTest {

  @Mock
  private KafkaTemplate<String, UserAccountOperation> kafkaTemplate;

  private final CashTransactionProducer cashTransactionProducer;

  public CashTransactionProducerTest() {
    MockitoAnnotations.openMocks(this);
    String bootstrapServers = "localhost:9092";
    cashTransactionProducer = new CashTransactionProducer(bootstrapServers);
    ReflectionTestUtils.setField(cashTransactionProducer, "kafkaTemplate", kafkaTemplate);
  }

  @Test
  void sendMessage_should_sendUserAccountOperationToDefinedTopic_when_methodCalled() {

    String topic = TopicToInternalBackend.CASH_TRANSACTION;
    String operation = "testOperation";
    UserAccountOperation userAccountOperation = new UserAccountOperation(
        100L, UUID.randomUUID(), "EUR");
    CompletableFuture<SendResult<String, UserAccountOperation>> future = mock(
        CompletableFuture.class);
    when(kafkaTemplate.send(topic, operation, userAccountOperation)).thenReturn(future);

    cashTransactionProducer.sendMessage(operation, userAccountOperation);

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