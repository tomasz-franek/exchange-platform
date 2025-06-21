package org.exchange.app.backend.external.services;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import lombok.AllArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.exchange.app.backend.common.keycloak.AuthenticationFacade;
import org.exchange.app.backend.common.utils.ExchangeDateUtils;
import org.exchange.app.backend.db.entities.ExchangeEventEntity;
import org.exchange.app.backend.db.mappers.ExchangeEventMapper;
import org.exchange.app.backend.db.repositories.ExchangeEventRepository;
import org.exchange.app.backend.db.repositories.UserAccountRepository;
import org.exchange.app.backend.db.specifications.ExchangeEventSpecification;
import org.exchange.app.backend.external.producers.InternalTicketProducer;
import org.exchange.app.common.api.model.EventType;
import org.exchange.app.common.api.model.UserTicket;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

@Log4j2
@Service
@AllArgsConstructor
public class TicketsServiceImpl implements TicketsService {

  private final InternalTicketProducer internalTicketProducer;

  private final ExchangeEventRepository exchangeEventRepository;

  private final UserAccountRepository userAccountRepository;

  private final AuthenticationFacade authenticationFacade;


  @Override
  public void saveUserTicket(UserTicket userTicket) {
    UUID userId = authenticationFacade.getUserUuid();
    userTicket.setUserId(userId);
    userTicket.setEventType(EventType.EXCHANGE);
    try {
      internalTicketProducer.sendMessage(userTicket);
    } catch (Exception e) {
      log.error(e.getMessage());
    }
  }

  @Override
  public void cancelExchangeTicket(UserTicket userTicket) {
    UUID userId = authenticationFacade.getUserUuid();
    userTicket.setUserId(userId);
    userTicket.setEventType(EventType.CANCEL);
    internalTicketProducer.sendMessage(userTicket);
  }

  @Override
  public List<UserTicket> loadUserTicketList() {
    List<UserTicket> userTicketList = new ArrayList<>();
    UUID userId = authenticationFacade.getUserUuid();
    Specification<ExchangeEventEntity> exchangeEventSourceSpecification =
        ExchangeEventSpecification
            .userAccountID(userAccounts(userId))
            .and(
                ExchangeEventSpecification.fromDate(
                    ExchangeDateUtils.toEpochUtc(
                        ExchangeDateUtils.currentLocalDateTime().minusDays(10)))
            );
    exchangeEventRepository.findAll(exchangeEventSourceSpecification)
        .forEach(exchangeEventSourceEntity -> {
          userTicketList.add(ExchangeEventMapper.INSTANCE.toDto(exchangeEventSourceEntity));
        });
    return userTicketList;
  }

  private List<UUID> userAccounts(UUID userId) {
    return userAccountRepository.findAccountsForUser(userId);
  }
}
