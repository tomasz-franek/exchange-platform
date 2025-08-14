package org.exchange.app.backend.external.services;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.List;
import java.util.UUID;
import org.exchange.app.backend.common.exceptions.InsufficientFundsException;
import org.exchange.app.backend.common.exceptions.ObjectWithIdNotFoundException;
import org.exchange.app.backend.common.keycloak.AuthenticationFacade;
import org.exchange.app.backend.db.repositories.ExchangeEventRepository;
import org.exchange.app.backend.db.repositories.UserAccountRepository;
import org.exchange.app.backend.external.producers.InternalTicketProducer;
import org.exchange.app.common.api.model.Direction;
import org.exchange.app.common.api.model.EventType;
import org.exchange.app.common.api.model.Pair;
import org.exchange.app.common.api.model.UserTicket;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.bean.override.mockito.MockitoBean;

@SpringBootTest
@AutoConfigureMockMvc
class TicketsServiceImplTest {

  private final UUID EXISTING_UUID = UUID.fromString("00000000-0000-0000-0002-000000000001");

  @MockitoBean
  private InternalTicketProducer internalTicketProducer;
  @Autowired
  private TicketsServiceImpl ticketsService;

  @Autowired
  private UserAccountRepository userAccountRepository;

  @Autowired
  private ExchangeEventRepository exchangeEventRepository;

  @MockitoBean
  private AuthenticationFacade authenticationFacade;

  @Test
  public void cancelExchangeTicket_should_sendMessageToTicketProducer_when_methodIsCalled() {
    UserTicket userTicket = new UserTicket();
    UUID userId = UUID.randomUUID();
    userTicket.setUserId(UUID.randomUUID());
    when(authenticationFacade.getUserUuid()).thenReturn(userId);
    doNothing().when(internalTicketProducer).sendMessage(any());
    ticketsService.cancelExchangeTicket(userTicket);

    ArgumentCaptor<UserTicket> captor = ArgumentCaptor.forClass(UserTicket.class);
    verify(internalTicketProducer, times(1)).sendMessage(captor.capture());

    UserTicket capturedTicket = captor.getValue();
    assertThat(capturedTicket.getUserId()).isEqualTo(userId);
    assertThat(capturedTicket.getEventType()).isEqualTo(EventType.CANCEL);
  }

  @Test
  public void loadUserTicketList_should_returnListOfTheTickets_when_methodIsCalled() {
    when(authenticationFacade.getUserUuid()).thenReturn(EXISTING_UUID);

    List<UserTicket> list = ticketsService.loadUserTicketList();

    assertThat(list.size()).isEqualTo(1);
  }

  @Test
  public void saveUserTicket_should_throwException_when_currencyIsNull() {
    when(authenticationFacade.getUserUuid()).thenReturn(EXISTING_UUID);
    UserTicket userTicket = new UserTicket();
    userTicket.setDirection(Direction.BUY);

    ObjectWithIdNotFoundException exception = assertThrows(ObjectWithIdNotFoundException.class,
        () -> ticketsService.saveUserTicket(userTicket));

    assertThat(exception.getExceptionRecord().getMessage()).isEqualTo(
        "Object UserAccount with id=Currency for Pair null and Direction BUY not found");
  }

  @Test
  public void saveUserTicket_should_throwException_when_notExistsAccountForTheUserAndCurrency() {
    when(authenticationFacade.getUserUuid()).thenReturn(UUID.randomUUID());
    UserTicket userTicket = new UserTicket();
    userTicket.setDirection(Direction.BUY);
    userTicket.setPair(Pair.EUR_GBP);

    ObjectWithIdNotFoundException exception = assertThrows(ObjectWithIdNotFoundException.class,
        () -> ticketsService.saveUserTicket(userTicket));

    assertThat(exception.getExceptionRecord().getMessage()).isEqualTo(
        "Object UserAccount with id=Not found account for currency GBP not found");
  }

  @Test
  public void saveUserTicket_should_throwException_when_insufficientFunds() {
    when(authenticationFacade.getUserUuid()).thenReturn(EXISTING_UUID);
    UserTicket userTicket = new UserTicket();
    userTicket.setDirection(Direction.BUY);
    userTicket.setPair(Pair.EUR_PLN);
    userTicket.setAmount(2_000_000_0000L);

    InsufficientFundsException exception = assertThrows(InsufficientFundsException.class,
        () -> ticketsService.saveUserTicket(userTicket));

    assertThat(exception.getExceptionResponse().getMessage()).isEqualTo(
        "Insufficient fund for currency='PLN'");
  }


  @Test
  public void saveUserTicket_should_throwException_when_notFoundAccountForReverseCurrency() {
    when(authenticationFacade.getUserUuid()).thenReturn(EXISTING_UUID);
    UserTicket userTicket = new UserTicket();
    userTicket.setDirection(Direction.BUY);
    userTicket.setPair(Pair.EUR_CHF);
    userTicket.setAmount(2_0000L);

    ObjectWithIdNotFoundException exception = assertThrows(ObjectWithIdNotFoundException.class,
        () -> ticketsService.saveUserTicket(userTicket));

    assertThat(exception.getExceptionRecord().getMessage()).isEqualTo(
        "Object UserAccount with id=Not found account for currency CHF not found");
  }


  @Test
  public void saveUserTicket_should_sendUserTicketToInternalTicketProducer_when_correctData() {
    when(authenticationFacade.getUserUuid()).thenReturn(EXISTING_UUID);
    UserTicket userTicket = new UserTicket();
    userTicket.setDirection(Direction.BUY);
    userTicket.setPair(Pair.EUR_PLN);
    userTicket.setAmount(2_0000L);
    doNothing().when(internalTicketProducer).sendMessage(any());
    ticketsService.saveUserTicket(userTicket);

    ArgumentCaptor<UserTicket> captor = ArgumentCaptor.forClass(UserTicket.class);
    verify(internalTicketProducer, times(1)).sendMessage(captor.capture());

    UserTicket capturedTicket = captor.getValue();
    assertThat(capturedTicket.getUserId()).isEqualTo(EXISTING_UUID);
    assertThat(capturedTicket.getEventType()).isEqualTo(EventType.ORDER);
  }

}