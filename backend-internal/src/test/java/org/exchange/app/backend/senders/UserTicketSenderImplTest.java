package org.exchange.app.backend.senders;

import static org.mockito.Mockito.never;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;

import org.exchange.app.backend.common.config.KafkaConfig.TopicToInternalBackend;
import org.exchange.app.common.api.model.Pair;
import org.exchange.app.common.api.model.UserTicket;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.kafka.core.KafkaTemplate;

class UserTicketSenderImplTest {

  @Mock
  private KafkaTemplate<Pair, UserTicket> kafkaTemplate;

  @InjectMocks
  private UserTicketSenderImpl userTicketSender;

  @BeforeEach
  public void setUp() {
    MockitoAnnotations.openMocks(this);
  }

  @Test
  public void sendMessage_should_sendUserTicket_when_correctUserTicket() {
    UserTicket userTicket = new UserTicket();
    userTicket.setPair(Pair.EUR_GBP);
    userTicketSender.sendMessage(userTicket);

    verify(kafkaTemplate, times(1)).send(TopicToInternalBackend.EXCHANGE, userTicket.getPair(),
        userTicket);
  }

  @Test
  public void sendOrderBookData_should_notSendRequest_when_nullUserTicket() {
    UserTicket userTicket = null;

    userTicketSender.sendMessage(userTicket);

    verify(kafkaTemplate, never()).send(TopicToInternalBackend.EXCHANGE, userTicket);
  }
}