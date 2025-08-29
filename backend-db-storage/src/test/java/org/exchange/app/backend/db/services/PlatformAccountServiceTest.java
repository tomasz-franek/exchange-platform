package org.exchange.app.backend.db.services;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertThrows;

import java.util.UUID;
import org.exchange.app.backend.common.exceptions.ObjectWithIdNotFoundException;
import org.exchange.app.backend.db.DbStorageConfig;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.CsvSource;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ContextConfiguration;


@SpringBootTest
@ContextConfiguration(classes = {DbStorageConfig.class})
class PlatformAccountServiceTest {

  @Autowired
  private PlatformAccountService platformAccountService;

  @ParameterizedTest
  @CsvSource(value = {
      "PLN;921467e9-6fde-46e7-a329-000000000001",
      "EUR;921467e9-6fde-46e7-a329-000000000002",
      "GBP;921467e9-6fde-46e7-a329-000000000003",
      "CHF;921467e9-6fde-46e7-a329-000000000004",
      "USD;921467e9-6fde-46e7-a329-000000000005",
  },delimiter = ';')
  void getExchangeAccountId_should_returnCorrectAccountID_when_calledWithCorrectCurrency(String currency, String exchangeAccountId) {
    assertThat(platformAccountService.getExchangeAccountId(currency)).isEqualTo(UUID.fromString(exchangeAccountId));
  }

  @Test
  void getExchangeAccountId_should_throwObjectNotFoundException_when_calledWithEmptyCurrency() {
    ObjectWithIdNotFoundException exception = assertThrows(ObjectWithIdNotFoundException.class,
        () -> platformAccountService.getExchangeAccountId(""));
    assertThat(exception.getExceptionRecord().getMessage()).isEqualTo("Object Currency with id= not found");
  }

  @Test
  void getExchangeAccountId_should_throwObjectNotFoundException_when_calledWithNotHandled() {
    ObjectWithIdNotFoundException exception = assertThrows(ObjectWithIdNotFoundException.class,
        () -> platformAccountService.getExchangeAccountId("JPY"));
    assertThat(exception.getExceptionRecord().getMessage()).isEqualTo("Object Currency with id=JPY not found");
  }

  @ParameterizedTest
  @CsvSource(value = {
      "PLN;8d8a228a-19a4-4f71-9f69-000000000001",
      "EUR;8d8a228a-19a4-4f71-9f69-000000000002",
      "GBP;8d8a228a-19a4-4f71-9f69-000000000003",
      "CHF;8d8a228a-19a4-4f71-9f69-000000000004",
      "USD;8d8a228a-19a4-4f71-9f69-000000000005",
  },delimiter = ';')
  void getSystemAccountId_should_returnCorrectAccountID_when_calledWithCorrectCurrency(String currency, String exchangeAccountId) {
    assertThat(platformAccountService.getSystemAccountId(currency)).isEqualTo(UUID.fromString(exchangeAccountId));
  }

  @Test
  void getSystemAccountId_should_throwObjectNotFoundException_when_calledWithEmptyCurrency() {
    ObjectWithIdNotFoundException exception = assertThrows(ObjectWithIdNotFoundException.class,
        () -> platformAccountService.getSystemAccountId(""));
    assertThat(exception.getExceptionRecord().getMessage()).isEqualTo("Object Currency with id= not found");
  }

  @Test
  void getSystemAccountId_should_throwObjectNotFoundException_when_calledWithNotHandled() {
    ObjectWithIdNotFoundException exception = assertThrows(ObjectWithIdNotFoundException.class,
        () -> platformAccountService.getSystemAccountId("JPY"));
    assertThat(exception.getExceptionRecord().getMessage()).isEqualTo("Object Currency with id=JPY not found");
  }

}