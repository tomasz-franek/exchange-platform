package org.exchange.app.backend.senders;

import java.util.concurrent.CompletableFuture;
import org.exchange.app.backend.common.builders.ExchangeResult;
import org.exchange.app.backend.common.config.KafkaConfig.TopicToInternalBackend;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.kafka.KafkaException;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.kafka.support.SendResult;

import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class ExchangeResultSenderImplTest {

  @Mock
  private KafkaTemplate<String, ExchangeResult> kafkaTemplate;

  private ExchangeResultSenderImpl exchangeResultSender;

  @BeforeEach
  void setUp() {
    kafkaTemplate = mock(KafkaTemplate.class);
    exchangeResultSender = new ExchangeResultSenderImpl(kafkaTemplate);
  }

  @Test
  void sendExchangeResult_should_returnCompletedFuture_when_correctExchangeResult() {
    ExchangeResult exchangeResult = new ExchangeResult();
    SendResult<String, ExchangeResult> sendResult = mock(SendResult.class);

    CompletableFuture<SendResult<String, ExchangeResult>> future = CompletableFuture.completedFuture(
        sendResult);
    when(kafkaTemplate.send(TopicToInternalBackend.EXCHANGE_RESULT, "", exchangeResult)).thenReturn(
        future);

    exchangeResultSender.sendExchangeResult(exchangeResult);

    verify(kafkaTemplate, times(1)).send(TopicToInternalBackend.EXCHANGE_RESULT, "",
        exchangeResult);
  }

  @Test
  void sendExchangeResult_should_returnError_when_methodCompletedExceptionally() {
    ExchangeResult exchangeResult = new ExchangeResult();
    CompletableFuture<SendResult<String, ExchangeResult>> future = new CompletableFuture<>();

    exchangeResultSender.sendExchangeResult(exchangeResult);

    future.completeExceptionally(new KafkaException("Kafka error"));

    verify(kafkaTemplate, times(1)).send(TopicToInternalBackend.EXCHANGE_RESULT, "",
        exchangeResult);
  }
}