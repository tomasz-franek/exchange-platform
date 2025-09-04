package org.exchange.app.backend.senders;

import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.sql.Date;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import org.exchange.app.backend.common.config.KafkaConfig.TopicToInternalBackend;
import org.exchange.app.backend.db.repositories.ExchangeEventSourceRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.kafka.core.KafkaTemplate;

public class SnapshotSenderImplTest {

  @Mock
  private KafkaTemplate<String, String> kafkaTemplate;

  @Mock
  private ExchangeEventSourceRepository exchangeEventSourceRepository;

  @InjectMocks
  private SnapshotSenderImpl snapshotSender;

  @BeforeEach
  public void setUp() {
    MockitoAnnotations.openMocks(this);
  }

  @Test
  public void sendMessage_shouldSendMessageToKafka_when_daysWithoutSnapshot() {
    List<String> days = Arrays.asList("2025-09-01", "2025-09-02");
    String expectedSnapshotRequest = "2025-09-01:2025-09-02";

    snapshotSender.sendMessage(days);

    verify(kafkaTemplate, times(1)).send(TopicToInternalBackend.SNAPSHOT, expectedSnapshotRequest);
  }

  @Test
  public void sendMessage_shouldNotSendMessageToKafka_when_emptyDays() {
    List<String> days = Collections.emptyList();

    snapshotSender.sendMessage(days);

    verify(kafkaTemplate, never()).send(anyString(), anyString());
  }

  @Test
  public void checkSnapshot_should_sendDaysWithoutSnapshot_when_exists() {
    when(exchangeEventSourceRepository.getDaysWithoutSnapshot()).thenReturn(
        Arrays.asList(Date.valueOf("2025-09-01"), Date.valueOf("2025-09-02")));

    snapshotSender.checkSnapshot();

    verify(exchangeEventSourceRepository, times(1)).getDaysWithoutSnapshot();
    verify(kafkaTemplate, times(1)).send(TopicToInternalBackend.SNAPSHOT, "2025-09-01:2025-09-02");
  }

  @Test
  public void checkSnapshot_should_notSendDays_when_noDaysWithoutSnapshot() {
    when(exchangeEventSourceRepository.getDaysWithoutSnapshot()).thenReturn(
        Collections.emptyList());

    snapshotSender.checkSnapshot();

    verify(exchangeEventSourceRepository, times(1)).getDaysWithoutSnapshot();
    verify(kafkaTemplate, never()).send(anyString(), anyString());
  }
}