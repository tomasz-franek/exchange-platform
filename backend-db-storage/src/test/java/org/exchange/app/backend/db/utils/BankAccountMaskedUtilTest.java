package org.exchange.app.backend.db.utils;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;

class BankAccountMaskedUtilTest {

  @Test
  void maskBankAccount_should_returnEmptyString_when_bankAccountIsEmpty() {
    assertThat(BankAccountMaskedUtil.maskBankAccount("")).isEqualTo("");
  }

  @Test
  void maskBankAccount_should_returnTwoLettersThenStarsThenFourLetters_when_bankAccountLengthIsMoreThan8() {
    assertThat(BankAccountMaskedUtil.maskBankAccount("123456789")).isEqualTo("12****6789");
  }

  @Test
  void maskBankAccount_should_returnTwoLettersThenStarsThenFourLetters_when_bankAccountLengthIsMoreThan12() {
    assertThat(BankAccountMaskedUtil.maskBankAccount("123456789012")).isEqualTo("1234****9012");
  }

  @Test
  void maskBankAccount_should_returnTwoLettersThenStarsThen2Letters_when_bankAccountLengthIsLessThan8() {
    assertThat(BankAccountMaskedUtil.maskBankAccount("1234567")).isEqualTo("12****67");
  }
}