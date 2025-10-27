package org.exchange.app.backend.admin.services;

import static org.assertj.core.api.Assertions.assertThat;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import org.exchange.app.admin.api.model.AccountsReportResponse;
import org.exchange.app.backend.db.entities.ExchangeEventSourceEntity;
import org.exchange.app.common.api.model.Currency;
import org.exchange.app.common.api.model.EventType;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.CsvSource;

class AdminReportsServiceImplTest {

  private static List<ExchangeEventSourceEntity> events;

  @BeforeAll
  public static void initializeTestData() {
    events = prepareTestEventList();
  }

  @ParameterizedTest
  @CsvSource(value = {
      "EUR;DEPOSIT;100",
      "USD;WITHDRAW;-200",
      "CHF;CANCEL;-200",
      "GBP;CORRECTION;100",
      "CHF;FEE;-220",
      "PLN;FEE;-140",
      "USD;FEE;-120",
  }, delimiter = ';')
  void countEventTypeAmountSumPerCurrency_should_returnCorrectSum_when_preparedListOfEvents(
      String currency, String eventType, Long amount) {
    Map<String, Map<EventType, Long>> currencyEventTypeAmountMap = AdminReportsServiceImpl.countEventTypeAmountSumPerCurrency(
        events);
    assertThat(
        currencyEventTypeAmountMap.get(currency)
            .getOrDefault(EventType.fromValue(eventType), amount - 1)).isEqualTo(amount);
  }

  private static List<ExchangeEventSourceEntity> prepareTestEventList() {
    List<ExchangeEventSourceEntity> entities = new ArrayList<>();
    entities.add(prepareEvent("EUR", EventType.DEPOSIT, 100L));
    entities.add(prepareEvent("USD", EventType.DEPOSIT, 400L));
    entities.add(prepareEvent("USD", EventType.WITHDRAW, -100L));
    entities.add(prepareEvent("USD", EventType.WITHDRAW, -100L));
    entities.add(prepareEvent("USD", EventType.EXCHANGE, -100L));
    entities.add(prepareEvent("USD", EventType.CORRECTION, -300L));
    entities.add(prepareEvent("GBP", EventType.CORRECTION, 100L));
    entities.add(prepareEvent("CHF", EventType.CANCEL, -100L));
    entities.add(prepareEvent("CHF", EventType.CANCEL, -100L));
    entities.add(prepareEvent("USD", EventType.CANCEL, -50L));
    entities.add(prepareEvent("USD", EventType.FEE, -10L));
    entities.add(prepareEvent("CHF", EventType.FEE, -100L));
    entities.add(prepareEvent("CHF", EventType.FEE, -120L));
    entities.add(prepareEvent("PLN", EventType.FEE, -140L));
    entities.add(prepareEvent("USD", EventType.FEE, -110L));
    return entities;
  }

  @ParameterizedTest
  @CsvSource(value = {
      "EUR;0;100;0;0;0;0",
      "USD;-200;400;-100;-120;-300;-50",
      "CHF;0;0;0;-220;0;-200",
      "GBP;0;0;0;0;100;0",
      "PLN;0;0;0;-140;0;0",
  }, delimiter = ';')
  void getAccountsReportResponse(String currency, Long withdraws, Long deposit, Long exchange,
      Long fee, Long correction, Long cancellation) {
    Map<String, Map<EventType, Long>> currencyEventTypeAmountMap = AdminReportsServiceImpl.countEventTypeAmountSumPerCurrency(
        events);
    AccountsReportResponse accountsReportResponse = AdminReportsServiceImpl.getAccountsReportResponse(
        currency, currencyEventTypeAmountMap.getOrDefault(currency, new HashMap<>()));
    assertThat(accountsReportResponse.getAmountWithdraws()).isEqualTo(withdraws);
    assertThat(accountsReportResponse.getAmountDeposits()).isEqualTo(deposit);
    assertThat(accountsReportResponse.getAmountExchanges()).isEqualTo(exchange);
    assertThat(accountsReportResponse.getAmountFees()).isEqualTo(fee);
    assertThat(accountsReportResponse.getAmountCorrections()).isEqualTo(correction);
    assertThat(accountsReportResponse.getAmountCancellations()).isEqualTo(cancellation);
    assertThat(accountsReportResponse.getCurrency()).isEqualTo(Currency.valueOf(currency));
  }

  private static ExchangeEventSourceEntity prepareEvent(String currency, EventType eventType,
      Long amount) {
    ExchangeEventSourceEntity exchangeEventSourceEntity = new ExchangeEventSourceEntity();
    exchangeEventSourceEntity.setAmount(amount);
    exchangeEventSourceEntity.setCurrency(currency);
    exchangeEventSourceEntity.setEventType(eventType);
    return exchangeEventSourceEntity;
  }
}