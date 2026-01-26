package org.exchange.app.backend.db.services;

import static org.assertj.core.api.Assertions.assertThat;

import org.exchange.app.backend.db.DbStorageConfig;
import org.exchange.app.common.api.model.Currency;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.CsvSource;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ContextConfiguration;

@SpringBootTest
@ContextConfiguration(classes = {DbStorageConfig.class})
class WithdrawServiceImplTest {

  @Autowired
  private WithdrawService withdrawService;

  @ParameterizedTest
  @CsvSource(value = {
      "PLN;0",
      "EUR;0",
      "GBP;0",
      "CHF;0",
      "USD;1000000",
  }, delimiter = ';')
  void getMinimalAmountForCurrency_should_returnDefinedAmount_when_calledWithSpecificCurrency(
      String currency,
      Long amount) {
    assertThat(withdrawService.getMinimalAmountForCurrency(Currency.fromValue(currency))).isEqualTo(
        amount);

  }
}