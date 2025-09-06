package org.exchange.app.backend.senders;

import static org.exchange.app.common.api.model.Direction.BUY;
import static org.exchange.app.common.api.model.Pair.EUR_PLN;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;

import java.util.UUID;
import org.exchange.app.backend.common.builders.CoreTicketBuilder;
import org.exchange.app.backend.common.builders.ExchangeResult;
import org.exchange.app.backend.common.config.KafkaConfig.TopicToInternalBackend;
import org.exchange.app.common.api.model.UserTicketStatus;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.kafka.core.KafkaTemplate;

class FeeCalculationSenderImplTest {

  @Mock
  private KafkaTemplate<String, String> kafkaTemplate;

  @InjectMocks
  private FeeCalculationSenderImpl feeCalculationSender;

  @BeforeEach
  public void setUp() {
    MockitoAnnotations.openMocks(this);
  }

  @Test
  void sendFeeCalculation_should_sendEvent_when_buyTicketAfterExchangeInExchangeResult() {
    ExchangeResult exchangeResult = new ExchangeResult();
    exchangeResult.setBuyTicketAfterExchange(
        CoreTicketBuilder.createBuilder().withId(4L).withUserId(UUID.randomUUID()).withPair(EUR_PLN)
            .withDirection(BUY).withRatio("4.0023").withAmount(20).build());
    exchangeResult.setBuyTicket(
        CoreTicketBuilder.createBuilder().withId(4L).withUserId(UUID.randomUUID()).withPair(EUR_PLN)
            .withDirection(BUY).withRatio("4.0023").withAmount(2000).build());

    feeCalculationSender.sendFeeCalculation(exchangeResult);

    verify(kafkaTemplate, times(1)).send(TopicToInternalBackend.FEE_CALCULATION, "", "4");
  }

  @Test
  void sendFeeCalculation_should_sendEvent_when_sellTicketAfterExchangeInExchangeResult() {

    ExchangeResult exchangeResult = new ExchangeResult();
    exchangeResult.setSellTicketAfterExchange(
        CoreTicketBuilder.createBuilder().withId(4L).withUserId(UUID.randomUUID()).withPair(EUR_PLN)
            .withDirection(BUY).withRatio("4.0023").withAmount(20).build());
    exchangeResult.setSellTicket(
        CoreTicketBuilder.createBuilder().withId(4L).withUserId(UUID.randomUUID()).withPair(EUR_PLN)
            .withDirection(BUY).withRatio("4.0023").withAmount(2000).build());

    feeCalculationSender.sendFeeCalculation(exchangeResult);

    verify(kafkaTemplate, times(1)).send(TopicToInternalBackend.FEE_CALCULATION, "", "4");
  }

  @Test
  void sendFeeCalculation_should_sendEvent_when_cancelTicketAndStatusPartialRealized() {
    ExchangeResult exchangeResult = new ExchangeResult();
    exchangeResult.setCancelledTicket(
        CoreTicketBuilder.createBuilder().withId(4L).withUserId(UUID.randomUUID()).withPair(EUR_PLN)
            .withDirection(BUY).withRatio("4.0023").withAmount(20).build());
    exchangeResult.setUserTicketStatus(UserTicketStatus.PARTIAL_CANCELED);

    feeCalculationSender.sendFeeCalculation(exchangeResult);

    verify(kafkaTemplate, times(1)).send(TopicToInternalBackend.FEE_CALCULATION, "", "4");
  }

  @Test
  void sendFeeCalculation_should_notSendEvent_when_cancelTicketAndStatusCancelled() {
    ExchangeResult exchangeResult = new ExchangeResult();
    exchangeResult.setCancelledTicket(
        CoreTicketBuilder.createBuilder().withId(4L).withUserId(UUID.randomUUID()).withPair(EUR_PLN)
            .withDirection(BUY).withRatio("4.0023").withAmount(20).build());
    exchangeResult.setUserTicketStatus(UserTicketStatus.CANCELLED);

    feeCalculationSender.sendFeeCalculation(exchangeResult);

    verify(kafkaTemplate, never()).send(anyString(), anyString());
  }

  @Test
  public void sendFeeCalculation_should_notSendEvent_when_emptyExchangeResult() {
    ExchangeResult exchangeResult = new ExchangeResult();

    feeCalculationSender.sendFeeCalculation(exchangeResult);

    verify(kafkaTemplate, never()).send(anyString(), anyString());
  }

  @Test
  public void sendFeeCalculation_should_notSendEvent_when_incompleteBuyTicket() {
    ExchangeResult exchangeResult = new ExchangeResult();
    exchangeResult.setBuyTicketAfterExchange(
        CoreTicketBuilder.createBuilder().withId(4L).withUserId(UUID.randomUUID()).withPair(EUR_PLN)
            .withDirection(BUY).withRatio("4.0023").withAmount(20).build());

    feeCalculationSender.sendFeeCalculation(exchangeResult);

    verify(kafkaTemplate, never()).send(anyString(), anyString());
  }

  @Test
  public void sendFeeCalculation_should_notSendEvent_when_incompleteSellTicket() {
    ExchangeResult exchangeResult = new ExchangeResult();
    exchangeResult.setSellTicketAfterExchange(
        CoreTicketBuilder.createBuilder().withId(4L).withUserId(UUID.randomUUID()).withPair(EUR_PLN)
            .withDirection(BUY).withRatio("4.0023").withAmount(20).build());

    feeCalculationSender.sendFeeCalculation(exchangeResult);

    verify(kafkaTemplate, never()).send(anyString(), anyString());
  }
}