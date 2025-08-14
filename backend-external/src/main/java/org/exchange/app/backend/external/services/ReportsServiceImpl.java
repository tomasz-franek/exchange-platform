package org.exchange.app.backend.external.services;

import static org.exchange.app.backend.common.config.SystemConfig.systemAddressId;
import static org.exchange.app.backend.db.specifications.ExchangeEventSourceSpecification.eventId;
import static org.exchange.app.backend.db.specifications.ExchangeEventSourceSpecification.eventTypes;

import java.time.ZoneOffset;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import org.exchange.app.backend.common.builders.CoreTicketBuilder;
import org.exchange.app.backend.common.exceptions.ObjectWithIdNotFoundException;
import org.exchange.app.backend.common.keycloak.AuthenticationFacade;
import org.exchange.app.backend.common.pdfs.ExchangeDataResult;
import org.exchange.app.backend.common.pdfs.ExchangePdfRow;
import org.exchange.app.backend.common.pdfs.ExchangeReportPdf;
import org.exchange.app.backend.db.entities.AddressEntity;
import org.exchange.app.backend.db.entities.ExchangeEventEntity;
import org.exchange.app.backend.db.entities.ExchangeEventSourceEntity;
import org.exchange.app.backend.db.mappers.AddressMapper;
import org.exchange.app.backend.db.repositories.AddressRepository;
import org.exchange.app.backend.db.repositories.ExchangeEventRepository;
import org.exchange.app.backend.db.repositories.ExchangeEventSourceRepository;
import org.exchange.app.common.api.model.EventType;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

@Service
public class ReportsServiceImpl implements ReportsService {

  private final AddressRepository addressRepository;
  private final ExchangeEventRepository exchangeEventRepository;
  private final ExchangeEventSourceRepository exchangeEventSourceRepository;
  private final AuthenticationFacade authenticationFacade;

  @Autowired
  public ReportsServiceImpl(AuthenticationFacade authenticationFacade,
      AddressRepository addressRepository,
      ExchangeEventRepository exchangeEventRepository,
      ExchangeEventSourceRepository exchangeEventSourceRepository) {
    this.authenticationFacade = authenticationFacade;
    this.addressRepository = addressRepository;
    this.exchangeEventRepository = exchangeEventRepository;
    this.exchangeEventSourceRepository = exchangeEventSourceRepository;
  }

  @Override
  public byte[] loadExchangePdfDocument(Long ticketId) {
    UUID userId = authenticationFacade.getUserUuid();
    AddressEntity systemAddress = addressRepository.findById(systemAddressId).orElseThrow(
        () -> new ObjectWithIdNotFoundException("SystemAddress", "system"));
    AddressEntity userAddress = addressRepository.findByUserId(userId).orElseThrow(
        () -> new ObjectWithIdNotFoundException("UserAddress", userId.toString()));
    ExchangeEventEntity exchangeEventEntity = exchangeEventRepository.findByIdAndUserId(ticketId,
        userId).orElseThrow(
        () -> new ObjectWithIdNotFoundException("Ticket", ticketId.toString())
    );

    ExchangeDataResult exchangeDataResult = getExchangeDataResult(
        systemAddress, userAddress, exchangeEventEntity);

    return ExchangeReportPdf.generatePdf(exchangeDataResult).toByteArray();
  }

  private void getExchangeResults(ExchangeDataResult exchangeDataResult,
      ExchangeEventEntity exchangeEventEntity) {
    List<ExchangePdfRow> exchangeTicketList = new ArrayList<>();
    List<ExchangeEventSourceEntity> resultEntityList = getExchangeResultEntities(
        exchangeEventEntity);
    resultEntityList.forEach(e -> {
      switch (e.getEventType()) {
        case EXCHANGE -> {
          if ("B".equals(exchangeEventEntity.getDirection())) {
            exchangeTicketList.add(
                new ExchangePdfRow(e.getAmount(), e.getReverseAmount(), e.getRatio()));
          } else {
            exchangeTicketList.add(
                new ExchangePdfRow(e.getReverseAmount(), e.getAmount(), e.getRatio()));
          }
        }
        case FEE -> exchangeDataResult.setFee(exchangeDataResult.getFee() + e.getAmount());
      }

    });
    exchangeDataResult.setExchangeCoreTicketList(exchangeTicketList);
  }

  private List<ExchangeEventSourceEntity> getExchangeResultEntities(
      ExchangeEventEntity exchangeEventEntity) {
    return exchangeEventSourceRepository.findAll(Specification.allOf(
        eventId(exchangeEventEntity.getId()),
        eventTypes(List.of(EventType.EXCHANGE, EventType.FEE))
    ));
  }


  private ExchangeDataResult getExchangeDataResult(AddressEntity systemAddress,
      AddressEntity userAddress, ExchangeEventEntity e) {
    ExchangeDataResult exchangeDataResult = new ExchangeDataResult();
    exchangeDataResult.setSystemAddress(AddressMapper.INSTANCE.toDto(systemAddress));
    exchangeDataResult.setRecipientAddress(AddressMapper.INSTANCE.toDto(userAddress));

    exchangeDataResult.setSourceTicket(
        CoreTicketBuilder.createBuilder()
            .withPair(e.getPair())
            .withDirection(e.getDirection())
            .withAmount(e.getAmount())
            .withId(e.getId())
            .withRatio(e.getRatio())
            .withEpochUTC(e.getDateUtc().toLocalDateTime().toEpochSecond(
                ZoneOffset.UTC))
            .build());
    getExchangeResults(exchangeDataResult, e);
    return exchangeDataResult;
  }
}
