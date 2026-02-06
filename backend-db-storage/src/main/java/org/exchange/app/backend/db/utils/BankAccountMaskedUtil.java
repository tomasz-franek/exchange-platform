package org.exchange.app.backend.db.utils;

import jakarta.validation.constraints.NotNull;

public class BankAccountMaskedUtil {

  private BankAccountMaskedUtil() {
  }
  private static final String STARS = "****";

  public static String maskBankAccount(@NotNull String bankAccount) {
    if (!bankAccount.isBlank()) {
      if (bankAccount.length() < 8) {
        return bankAccount.substring(0, 2) + STARS + bankAccount.substring(
            bankAccount.getBytes().length - 2);
      } else if (bankAccount.length() < 12) {
        return bankAccount.substring(0, 2) + STARS + bankAccount.substring(
            bankAccount.getBytes().length - 4);
      } else {
        return bankAccount.substring(0, 4) + STARS + bankAccount.substring(
            bankAccount.getBytes().length - 4);
      }
    }
    return bankAccount;
  }
}
