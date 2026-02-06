package org.exchange.app.backend.external.services;

import static org.exchange.app.backend.common.config.SystemConfig.systemAddressId;
import static org.exchange.app.backend.db.specifications.ExchangeEventSourceSpecification.eventId;
import static org.exchange.app.backend.db.specifications.ExchangeEventSourceSpecification.eventTypes;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import lombok.extern.log4j.Log4j2;
import org.exchange.app.backend.common.exceptions.ObjectWithIdNotFoundException;
import org.exchange.app.backend.common.keycloak.AuthenticationFacade;
import org.exchange.app.backend.common.pdfs.ExchangeDataResult;
import org.exchange.app.backend.common.pdfs.ExchangePdfRow;
import org.exchange.app.backend.common.pdfs.ExchangeReportPdf;
import org.exchange.app.backend.common.pdfs.FinancialPdfRow;
import org.exchange.app.backend.common.pdfs.FinancialReportPdf;
import org.exchange.app.backend.db.entities.AddressEntity;
import org.exchange.app.backend.db.entities.ExchangeEventEntity;
import org.exchange.app.backend.db.entities.ExchangeEventSourceEntity;
import org.exchange.app.backend.db.entities.UserAccountEntity;
import org.exchange.app.backend.db.mappers.AddressMapper;
import org.exchange.app.backend.db.mappers.ExchangeEventMapper;
import org.exchange.app.backend.db.repositories.AddressRepository;
import org.exchange.app.backend.db.repositories.ExchangeEventRepository;
import org.exchange.app.backend.db.repositories.ExchangeEventSourceRepository;
import org.exchange.app.backend.db.repositories.SnapshotDataRepository;
import org.exchange.app.backend.db.repositories.UserAccountRepository;
import org.exchange.app.backend.db.services.PlatformAccountService;
import org.exchange.app.backend.db.specifications.AccountSpecification;
import org.exchange.app.backend.db.specifications.ExchangeEventSourceSpecification;
import org.exchange.app.common.api.model.Currency;
import org.exchange.app.common.api.model.EventType;
import org.exchange.app.external.api.model.FinancialReportRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.data.domain.Sort.Order;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

@Log4j2
@Service
public class ReportsServiceImpl implements ReportsService {

  private final AddressRepository addressRepository;
  private final ExchangeEventRepository exchangeEventRepository;
  private final ExchangeEventSourceRepository exchangeEventSourceRepository;
  private final UserAccountRepository userAccountRepository;
  private final AuthenticationFacade authenticationFacade;
  private final PlatformAccountService platformAccountService;
  private final SnapshotDataRepository snapshotDataRepository;

  @Autowired
  public ReportsServiceImpl(AuthenticationFacade authenticationFacade,
      AddressRepository addressRepository,
      ExchangeEventRepository exchangeEventRepository,
      ExchangeEventSourceRepository exchangeEventSourceRepository,
      UserAccountRepository userAccountRepository,
      SnapshotDataRepository snapshotDataRepository,
      PlatformAccountService platformAccountService) {
    this.authenticationFacade = authenticationFacade;
    this.addressRepository = addressRepository;
    this.exchangeEventRepository = exchangeEventRepository;
    this.exchangeEventSourceRepository = exchangeEventSourceRepository;
    this.userAccountRepository = userAccountRepository;
    this.platformAccountService = platformAccountService;
    this.snapshotDataRepository = snapshotDataRepository;
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

  @Override
  public byte[] loadFinancialReportPdfDocument(FinancialReportRequest request) {
    UUID userId = authenticationFacade.getUserUuid();
    LocalDateTime dateFrom = LocalDateTime.of(request.getYear(), request.getMonth(), 1, 0, 0);
    LocalDateTime dateTo = dateFrom.plusMonths(1);
    Specification<UserAccountEntity> accountEntitySpecification = Specification.allOf(
        AccountSpecification.userAccountIDs(List.of(request.getUserAccountId())),
        AccountSpecification.userId(userId)
    );
    List<UserAccountEntity> accounts = userAccountRepository.findAll(accountEntitySpecification);
    Long initialBalance = snapshotDataRepository.initialBalanceForUserAccountIdAndDate(
        accounts.getFirst().getId(), dateFrom.toLocalDate());
    Specification<ExchangeEventSourceEntity> specification = Specification.allOf(
        ExchangeEventSourceSpecification.fromDateUtc(dateFrom),
        ExchangeEventSourceSpecification.toDateUtc(dateTo),
        ExchangeEventSourceSpecification.userAccountIDs(
            accounts.stream().map(UserAccountEntity::getId).toList())
    );
    List<ExchangeEventSourceEntity> list = exchangeEventSourceRepository.findAll(specification,
        Sort.by(Order.asc("dateUtc")));
    List<FinancialPdfRow> operations = new ArrayList<>();
    list.forEach(
        e -> operations.add(new FinancialPdfRow(
            e.getDateUtc(), e.getEventType(), e.getAmount(), Currency.fromValue(e.getCurrency()))));
    return FinancialReportPdf.generatePdf(operations, request, initialBalance,
        request.getCurrency()).toByteArray();
  }

  private void getExchangeResults(ExchangeDataResult exchangeDataResult,
      ExchangeEventEntity exchangeEventEntity) {
    List<ExchangePdfRow> exchangeTicketList = new ArrayList<>();
    List<ExchangeEventSourceEntity> resultEntityList = getExchangeResultEntities(
        exchangeEventEntity);
    resultEntityList.forEach(e -> {
      if (!platformAccountService.exchangeAccountIdsContain(e.getUserAccountId()) &&
          !platformAccountService.systemAccountIdsContain(e.getUserAccountId())) {
        if (EventType.EXCHANGE.equals(e.getEventType())) {
            if ("B".equals(exchangeEventEntity.getDirection())) {
              exchangeTicketList.add(
                  new ExchangePdfRow(e.getAmount(), e.getReverseAmount(), e.getRatio()));
            } else {
              exchangeTicketList.add(
                  new ExchangePdfRow(e.getReverseAmount(), e.getAmount(), e.getRatio()));
            }
          }
        if (EventType.FEE.equals(e.getEventType())) {
          exchangeDataResult.setFee(exchangeDataResult.getFee() + e.getAmount());
        }
      }

    });
    exchangeDataResult.setExchangePdfRows(exchangeTicketList);
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

    exchangeDataResult.setExchangeEvent(ExchangeEventMapper.INSTANCE.toExchangeEvent(e));
    getExchangeResults(exchangeDataResult, e);
    return exchangeDataResult;
  }
}
