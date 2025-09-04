package org.exchange.app.backend.senders;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.concurrent.CompletableFuture;
import nl.altindag.log.LogCaptor;
import org.apache.kafka.clients.producer.RecordMetadata;
import org.exchange.app.backend.common.builders.ExchangeResult;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.kafka.KafkaException;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.kafka.support.SendResult;

@ExtendWith(MockitoExtension.class)
public class ExchangeResultSenderImplTest {

  @Mock
  private KafkaTemplate<String, ExchangeResult> kafkaTemplate;

  @InjectMocks
  private ExchangeResultSenderImpl exchangeResultSender;

  private LogCaptor logCaptor;

  @BeforeEach
  public void setUp() {
    logCaptor = LogCaptor.forClass(ExchangeResultSenderImpl.class);
  }

  @Test
  public void sendExchangeResult_should_returnCompletedFuture_when_correctExchangeResult() {
    ExchangeResult exchangeResult = new ExchangeResult();
    SendResult<String, ExchangeResult> sendResult = mock(SendResult.class);
    RecordMetadata recordMetadata = mock(RecordMetadata.class);

    when(recordMetadata.offset()).thenReturn(1L);
    when(sendResult.getRecordMetadata()).thenReturn(recordMetadata);

    CompletableFuture<SendResult<String, ExchangeResult>> future = CompletableFuture.completedFuture(
        sendResult);
    when(kafkaTemplate.sendDefault(exchangeResult)).thenReturn(future);

    exchangeResultSender.sendExchangeResult(exchangeResult);

    verify(kafkaTemplate, times(1)).sendDefault(exchangeResult);
  }

  @Test
  public void sendExchangeResult_should_returnError_when_methodCompletedExceptionally() {
    ExchangeResult exchangeResult = new ExchangeResult();
    CompletableFuture<SendResult<String, ExchangeResult>> future = new CompletableFuture<>();

    when(kafkaTemplate.sendDefault(exchangeResult)).thenReturn(future);

    exchangeResultSender.sendExchangeResult(exchangeResult);

    future.completeExceptionally(new KafkaException("Kafka error"));

    verify(kafkaTemplate, times(1)).sendDefault(exchangeResult);
    String logMessage = logCaptor.getErrorLogs().getFirst();
    assertThat(logMessage).contains("Unexpected error while sending message: Kafka error");
  }
}