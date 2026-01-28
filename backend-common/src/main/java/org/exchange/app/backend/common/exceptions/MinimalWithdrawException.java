package org.exchange.app.backend.common.exceptions;

import java.lang.reflect.Type;
import lombok.Getter;

@Getter
public class MinimalWithdrawException extends RuntimeException {

  private final ExceptionResponse exceptionResponse;

  public MinimalWithdrawException(Type type, String currency, Long currentValue,
      Long minimalWithdrawAmount) {
    this.exceptionResponse = new ExceptionResponse(ExceptionResponse.getClassName(type),
        String.format(
            "Value=%d is lower than minimal withdraw amount currency='%s', minimalAmount=%d",
            currentValue, currency, minimalWithdrawAmount));
    this.exceptionResponse.setErrorCode("MINIMAL_WITHDRAW");
  }
}