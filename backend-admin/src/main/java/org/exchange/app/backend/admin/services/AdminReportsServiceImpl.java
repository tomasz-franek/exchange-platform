package org.exchange.app.backend.admin.services;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import lombok.AllArgsConstructor;
import org.exchange.app.admin.api.model.AccountOperation;
import org.exchange.app.admin.api.model.AccountOperationsRequest;
import org.exchange.app.admin.api.model.AccountsReportRequest;
import org.exchange.app.admin.api.model.AccountsReportResponse;
import org.exchange.app.admin.api.model.PairPeriodResponse;
import org.exchange.app.admin.api.model.TransactionsPdfRequest;
import org.exchange.app.backend.admin.pdfs.SystemOperationPdf;
import org.exchange.app.backend.common.keycloak.AuthenticationFacade;
import org.exchange.app.backend.common.utils.ExchangeDateUtils;
import org.exchange.app.backend.db.entities.ExchangeEventSourceEntity;
import org.exchange.app.backend.db.repositories.ExchangeEventRepository;
import org.exchange.app.backend.db.repositories.ExchangeEventSourceRepository;
import org.exchange.app.backend.db.specifications.ExchangeEventSourceSpecification;
import org.exchange.app.common.api.model.Currency;
import org.exchange.app.common.api.model.EventType;
import org.exchange.app.common.api.model.Pair;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

@Service
@AllArgsConstructor
public class AdminReportsServiceImpl implements AdminReportsService {

  private final AuthenticationFacade authenticationFacade;
  private final AdminAccountsService adminAccountsService;
  private final ExchangeEventSourceRepository exchangeEventSourceRepository;
  private final ExchangeEventRepository exchangeEventRepository;

  @Override
  public List<AccountsReportResponse> generateAccountsReport(
      AccountsReportRequest accountsReportRequest) {
    //authenticationFacade.checkIsAdmin(AccountsReportRequest.class);
    List<UUID> accountIds = adminAccountsService.loadUserAccountIds(
        accountsReportRequest.getUserId());

    Specification<ExchangeEventSourceEntity> exchangeEventSourceEntitySpecification = Specification.allOf(
        ExchangeEventSourceSpecification.userAccountIDs(accountIds),
        ExchangeEventSourceSpecification.fromDateUtc(accountsReportRequest.getDateFromUtc()));

    if (accountsReportRequest.getDateToUtc() != null) {
      exchangeEventSourceEntitySpecification = exchangeEventSourceEntitySpecification.and(
          ExchangeEventSourceSpecification.toDateUtc(accountsReportRequest.getDateToUtc()));
    }

    List<ExchangeEventSourceEntity> entities = exchangeEventSourceRepository.findAll(
        exchangeEventSourceEntitySpecification);
    Map<String, Map<EventType, Long>> map = countEventTypeAmountSumPerCurrency(
        entities);
    List<AccountsReportResponse> responseList = new ArrayList<>();
    map.forEach((k, v) -> {
      AccountsReportResponse accountsReportResponse = getAccountsReportResponse(k, v);
      responseList.add(accountsReportResponse);
    });

    return responseList;
  }

  public static Map<String, Map<EventType, Long>> countEventTypeAmountSumPerCurrency(
      List<ExchangeEventSourceEntity> entities) {
    Map<String, Map<EventType, Long>> map = new HashMap<>();
    entities.forEach(e -> {
      Map<EventType, Long> currencyMap = map.getOrDefault(e.getCurrency(), new HashMap<>());
      currencyMap.put(e.getEventType(),
          currencyMap.getOrDefault(e.getEventType(), 0L) + e.getAmount());
      map.put(e.getCurrency(), currencyMap);
    });
    return map;
  }

  public static AccountsReportResponse getAccountsReportResponse(String currency,
      Map<EventType, Long> ammountMap) {
    AccountsReportResponse accountsReportResponse = new AccountsReportResponse();
    accountsReportResponse.setReportDateUtc(ExchangeDateUtils.currentLocalDateTime());
    accountsReportResponse.setAmountCancellations(ammountMap.getOrDefault(EventType.CANCEL, 0L));
    accountsReportResponse.setAmountCorrections(ammountMap.getOrDefault(EventType.CORRECTION, 0L));
    accountsReportResponse.setAmountExchanges(ammountMap.getOrDefault(EventType.EXCHANGE, 0L));
    accountsReportResponse.setAmountWithdraws(ammountMap.getOrDefault(EventType.WITHDRAW, 0L));
    accountsReportResponse.setAmountDeposits(ammountMap.getOrDefault(EventType.DEPOSIT, 0L));
    accountsReportResponse.setAmountFees(ammountMap.getOrDefault(EventType.FEE, 0L));
    accountsReportResponse.setCurrency(Currency.valueOf(currency));
    return accountsReportResponse;
  }

  @Override
  public byte[] loadOperationPdfDocument(AccountOperationsRequest pdfDocumentRequest) {
    List<AccountOperation> operationList = adminAccountsService.loadAccountOperationList(
        pdfDocumentRequest);
    return SystemOperationPdf.generatePdf(operationList).toByteArray();
  }


  @Override
  public byte[] loadTransactionsPdfDocument(TransactionsPdfRequest transactionsPdfRequest) {
    List<AccountOperation> operationList = adminAccountsService.loadTransactionList(
        transactionsPdfRequest);
    return SystemOperationPdf.generatePdf(operationList).toByteArray();
  }

  @Override
  public PairPeriodResponse loadPairPeriodReport(Pair pair, Integer period) {
    LocalDateTime periodStart = ExchangeDateUtils.currentMinus(period, ChronoUnit.MONTHS);
    LocalDateTime periodEnd = ExchangeDateUtils.currentLocalDateTime();
    List<Object[]> result = exchangeEventRepository.loadPairPeriodReport(pair, periodStart,
        periodEnd);
    Long currentRation = exchangeEventRepository.getCurrentRatio(pair);
    PairPeriodResponse pairPeriodResponse = new PairPeriodResponse();
    pairPeriodResponse.minimumRatio(getRatio(Long.valueOf(result.getFirst()[0].toString())))
        .maximumRatio(getRatio(Long.valueOf(result.getFirst()[1].toString())))
        .currentRatio(getRatio(currentRation));
    return pairPeriodResponse;
  }

  private BigDecimal getRatio(Long value) {
    if (value == null) {
      return new BigDecimal("0.0000");
    }
    BigDecimal ratioValue = BigDecimal.valueOf(value);
    ratioValue = ratioValue.divide(BigDecimal.valueOf(1_0000), 4, RoundingMode.HALF_DOWN);
    return ratioValue;
  }
}
