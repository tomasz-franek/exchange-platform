package org.exchange.app.backend.external.services;

import static org.exchange.app.backend.common.config.SystemConfig.systemAddressId;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import org.exchange.app.backend.common.builders.CoreTicketBuilder;
import org.exchange.app.backend.common.exceptions.ObjectWithIdNotFoundException;
import org.exchange.app.backend.common.keycloak.AuthenticationFacade;
import org.exchange.app.backend.common.pdfs.ExchangeDataResult;
import org.exchange.app.backend.common.pdfs.ExchangeReport;
import org.exchange.app.backend.common.pdfs.ExchangeResult;
import org.exchange.app.backend.db.entities.AddressEntity;
import org.exchange.app.backend.db.entities.ExchangeEventEntity;
import org.exchange.app.backend.db.entities.ExchangeResultEntity;
import org.exchange.app.backend.db.mappers.AddressMapper;
import org.exchange.app.backend.db.repositories.AddressRepository;
import org.exchange.app.backend.db.repositories.ExchangeEventRepository;
import org.exchange.app.backend.db.repositories.ExchangeResultRepository;
import org.exchange.app.backend.db.specifications.ExchangeResultSpecification;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

@Service
public class ReportsServiceImpl implements ReportsService {

  private final AddressRepository addressRepository;
  private final ExchangeEventRepository exchangeEventRepository;
  private final ExchangeResultRepository exchangeResultRepository;
  private final AuthenticationFacade authenticationFacade;

  @Autowired
  public ReportsServiceImpl(AuthenticationFacade authenticationFacade,
      AddressRepository addressRepository,
      ExchangeEventRepository exchangeEventRepository,
      ExchangeResultRepository exchangeResultRepository) {
    this.authenticationFacade = authenticationFacade;
    this.addressRepository = addressRepository;
    this.exchangeEventRepository = exchangeEventRepository;
    this.exchangeResultRepository = exchangeResultRepository;
  }

  @Override
  public byte[] loadExchangePdfDocument(Long ticketId) {
    UUID userId = authenticationFacade.getUserUuid();
    AddressEntity systemAddress = addressRepository.findById(systemAddressId).orElseThrow(
        () -> new ObjectWithIdNotFoundException("SystemAddress", "system"));
    AddressEntity userAddress = addressRepository.findByUserId(userId).orElseThrow(
        () -> new ObjectWithIdNotFoundException("UserAddress", userId.toString()));

    ExchangeReport exchangeReport = new ExchangeReport();
    ExchangeDataResult exchangeDataResult = new ExchangeDataResult();
    exchangeDataResult.setSystemAddress(AddressMapper.INSTANCE.toDto(systemAddress));
    exchangeDataResult.setRecipientAddress(AddressMapper.INSTANCE.toDto(userAddress));
    ExchangeEventEntity exchangeEventEntity = exchangeEventRepository.findByIdAndUserId(ticketId,
        userId).orElseThrow(
        () -> new ObjectWithIdNotFoundException("Ticket", ticketId.toString())
    );
    exchangeDataResult.setSourceTicket(
        CoreTicketBuilder.createBuilder()
            .withPair(exchangeEventEntity.getPair())
            .withDirection(exchangeEventEntity.getDirection())
            .withAmount(exchangeEventEntity.getAmount())
            .withId(exchangeEventEntity.getId())
            .withRatio(exchangeEventEntity.getRatio())
            .withEpochUTC(exchangeEventEntity.getUpdatedDateUTC().getTime())
            .build());
    List<ExchangeResult> exchangeTicketList = new ArrayList<>();
    Specification<ExchangeResultEntity> resultEntitySpecification =
        exchangeEventEntity.getDirection().equals("S") ? ExchangeResultSpecification.sellTicketId(
            exchangeEventEntity.getId())
            : ExchangeResultSpecification.buyTicketId(exchangeEventEntity.getId());
    List<ExchangeResultEntity> resultEntityList = exchangeResultRepository.findAll(
        resultEntitySpecification);
    resultEntityList.forEach(e -> {
      ExchangeResult result = new ExchangeResult();
      result.setRatio(e.getRatio());
      result.setBuyAmount(e.getBuyAmount());
      result.setSellAmount(e.getSellAmount());
      exchangeTicketList.add(result);
    });
    exchangeDataResult.setExchangeCoreTicketList(exchangeTicketList);
    return exchangeReport.generateExchangeReport(
        exchangeDataResult).toByteArray();
  }
}
